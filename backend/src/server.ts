import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./lib/mongodb";
import authRoutes from "./routes/auth";
import servicesRoutes from "./routes/services";
import bulletinsRoutes from "./routes/bulletins";
import galleryRoutes from "./routes/gallery";
import submissionsRoutes from "./routes/submissions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/bulletins", bulletinsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/submissions", submissionsRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 CORS enabled for: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

start();
