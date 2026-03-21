import mongoose, { ConnectionStates } from 'mongoose';

/**
 * MongoDB connection configuration
 */
interface MongoConfig {
  uri: string;
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  maxIdleTimeMS: number;
  bufferCommands: boolean;
  retryAttempts: number;
  retryDelay: number;
  heartbeatFrequencyMS: number;
}

/**
 * Default configuration for different environments
 */
const getDefaultConfig = (): MongoConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    uri: process.env.MONGODB_URI || '',
    maxPoolSize: isProduction ? 20 : 10,
    serverSelectionTimeoutMS: isProduction ? 30000 : 10000,
    socketTimeoutMS: 45000,
    maxIdleTimeMS: 30000,
    bufferCommands: false,
    retryAttempts: isProduction ? 3 : 1,
    retryDelay: 1000,
    heartbeatFrequencyMS: 10000,
  };
};

/**
 * Connection cache interface
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnectionTime: number | null;
  connectionAttempts: number;
}

/**
 * Global cache for connection persistence across hot reloads
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

/**
 * Logger utility for structured logging
 */
class MongoLogger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [MongoDB] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  static info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  static error(message: string, meta?: any): void {
    console.error(this.formatMessage('error', message, meta));
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

/**
 * Validate MongoDB URI
 */
function validateMongoURI(uri: string): boolean {
  try {
    const url = new URL(uri);
    return url.protocol === 'mongodb:' || url.protocol === 'mongodb+srv:';
  } catch {
    return false;
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if connection is healthy
 */
function isConnectionHealthy(conn: typeof mongoose): boolean {
  return conn.connection.readyState === ConnectionStates.connected;
}

/**
 * Get connection status information
 */
function getConnectionStatus(conn: typeof mongoose): {
  state: string;
  name: string;
  host: string;
  port: number;
} {
  const connection = conn.connection;
  return {
    state: ConnectionStates[connection.readyState] || 'unknown',
    name: connection.name || 'unknown',
    host: connection.host || 'unknown',
    port: connection.port || 0,
  };
}

/**
 * Initialize global cache
 */
let cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  lastConnectionTime: null,
  connectionAttempts: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB with retry logic and comprehensive error handling
 */
async function connectWithRetry(config: MongoConfig, attempt = 1): Promise<typeof mongoose> {
  try {
    MongoLogger.info(`Attempting to connect to MongoDB (attempt ${attempt}/${config.retryAttempts})`);

    const connection = await mongoose.connect(config.uri, {
      maxPoolSize: config.maxPoolSize,
      serverSelectionTimeoutMS: config.serverSelectionTimeoutMS,
      socketTimeoutMS: config.socketTimeoutMS,
      maxIdleTimeMS: config.maxIdleTimeMS,
      bufferCommands: config.bufferCommands,
      heartbeatFrequencyMS: config.heartbeatFrequencyMS,
    });

    MongoLogger.info('Successfully connected to MongoDB', getConnectionStatus(connection));
    return connection;

  } catch (error: any) {
    MongoLogger.error(`Connection attempt ${attempt} failed:`, {
      error: error.message,
      code: error.code,
      name: error.name,
    });

    // Handle specific error types with actionable messages
    if (error.code === 'ENOTFOUND') {
      MongoLogger.error('DNS resolution failed. Check your MongoDB URI hostname and network connectivity.');
    } else if (error.code === 'ECONNREFUSED') {
      MongoLogger.error('Connection refused. Ensure MongoDB server is running and accessible.');
    } else if (error.code === 'ETIMEDOUT') {
      MongoLogger.error('Connection timed out. Check network connectivity and MongoDB server status.');
    } else if (error.name === 'MongoServerError' && error.code === 8000) {
      MongoLogger.error('Authentication failed. Verify username/password in MongoDB URI.');
    } else if (error.name === 'MongoServerError' && error.code === 18) {
      MongoLogger.error('Authentication failed. User may not exist or password is incorrect.');
    }

    // Retry logic for transient failures
    if (attempt < config.retryAttempts && isRetryableError(error)) {
      const delay = config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
      MongoLogger.info(`Retrying connection in ${delay}ms...`);
      await sleep(delay);
      return connectWithRetry(config, attempt + 1);
    }

    throw error;
  }
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: any): boolean {
  const retryableCodes = ['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'];
  const retryableNames = ['MongoNetworkError', 'MongoTimeoutError'];

  return retryableCodes.includes(error.code) || retryableNames.includes(error.name);
}

/**
 * Main database connection function
 */
async function dbConnect(): Promise<typeof mongoose> {
  // Validate environment
  const config = getDefaultConfig();

  if (!config.uri) {
    throw new Error(
      'MongoDB URI is not configured. Please set MONGODB_URI environment variable.'
    );
  }

  if (!validateMongoURI(config.uri)) {
    throw new Error(
      'Invalid MongoDB URI format. Expected mongodb:// or mongodb+srv:// protocol.'
    );
  }

  // Return existing healthy connection
  if (cached.conn && isConnectionHealthy(cached.conn)) {
    MongoLogger.debug('Using existing healthy MongoDB connection');
    return cached.conn;
  }

  // Wait for ongoing connection attempt
  if (cached.promise) {
    MongoLogger.debug('Waiting for ongoing MongoDB connection attempt...');
    try {
      cached.conn = await cached.promise;
      if (isConnectionHealthy(cached.conn)) {
        return cached.conn;
      }
      // Connection exists but is unhealthy, reset and retry
      MongoLogger.warn('Existing connection is unhealthy, resetting...');
    } catch (error) {
      MongoLogger.warn('Ongoing connection attempt failed, resetting...');
    }
    cached.promise = null;
    cached.conn = null;
  }

  // Create new connection
  MongoLogger.info('Initiating new MongoDB connection...');
  cached.connectionAttempts++;

  cached.promise = connectWithRetry(config)
    .then((connection) => {
      cached.conn = connection;
      cached.lastConnectionTime = Date.now();
      cached.connectionAttempts = 0; // Reset on success
      return connection;
    })
    .catch((error) => {
      // Reset cache on failure
      cached.promise = null;
      cached.conn = null;
      throw error;
    });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Final cleanup on complete failure
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

/**
 * Disconnect from MongoDB (useful for testing or graceful shutdown)
 */
async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    MongoLogger.info('Disconnecting from MongoDB...');
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    cached.lastConnectionTime = null;
    MongoLogger.info('Successfully disconnected from MongoDB');
  }
}

/**
 * Get connection health status
 */
function getConnectionHealth(): {
  isConnected: boolean;
  state: string;
  lastConnectionTime: number | null;
  connectionAttempts: number;
  details?: any;
} {
  const isConnected = cached.conn ? isConnectionHealthy(cached.conn) : false;

  return {
    isConnected,
    state: cached.conn ? getConnectionStatus(cached.conn).state : 'disconnected',
    lastConnectionTime: cached.lastConnectionTime,
    connectionAttempts: cached.connectionAttempts,
    details: cached.conn ? getConnectionStatus(cached.conn) : undefined,
  };
}

/**
 * Force reconnection (useful for recovery from connection issues)
 */
async function dbReconnect(): Promise<typeof mongoose> {
  MongoLogger.info('Forcing MongoDB reconnection...');

  // Clean up existing connection
  if (cached.conn) {
    try {
      await cached.conn.disconnect();
    } catch (error) {
      MongoLogger.warn('Error during forced disconnect:', error);
    }
  }

  // Reset cache
  cached.conn = null;
  cached.promise = null;
  cached.lastConnectionTime = null;

  // Reconnect
  return dbConnect();
}

// Export the main connection function and utilities
export default dbConnect;
export { dbDisconnect, getConnectionHealth, dbReconnect, MongoLogger };
