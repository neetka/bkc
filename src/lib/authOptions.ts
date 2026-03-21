import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

declare module 'next-auth' {
  interface User {
    role: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTH-OPTIONS] authorize() called with username:', credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log('[AUTH-OPTIONS] ❌ Missing credentials');
          return null;
        }

        try {
          await dbConnect();
          console.log('[AUTH-OPTIONS] ✅ DB connected for auth');

          const admin = await Admin.findOne({ username: credentials.username });
          if (!admin) {
            console.log('[AUTH-OPTIONS] ❌ Admin user not found:', credentials.username);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
          if (!isValid) {
            console.log('[AUTH-OPTIONS] ❌ Invalid password for user:', credentials.username);
            return null;
          }

          console.log('[AUTH-OPTIONS] ✅ Login successful for user:', admin.username);
          return { id: admin._id.toString(), name: admin.username, role: 'admin' };
        } catch (error) {
          console.error('[AUTH-OPTIONS] ❌ Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        console.log('[AUTH-OPTIONS] JWT callback - setting token role:', user.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
        console.log('[AUTH-OPTIONS] Session callback - user role:', token.role);
      }
      return session;
    },
  },
};