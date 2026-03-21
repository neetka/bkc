import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  console.log('[AUTH] requireAdmin() called');
  const session = await getServerSession(authOptions);
  console.log('[AUTH] Session result:', JSON.stringify(session));

  // Check if session exists
  if (!session) {
    console.log('[AUTH] ❌ No session found - returning 401');
    return NextResponse.json({
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    }, { status: 401 });
  }

  // Check if user has admin role
  if (!session.user || (session.user as any).role !== 'admin') {
    console.log('[AUTH] ❌ User does not have admin role - returning 403');
    return NextResponse.json({
      error: 'Insufficient permissions',
      message: 'Admin access required'
    }, { status: 403 });
  }

  console.log('[AUTH] ✅ Admin access granted for user:', session.user.name);
  return null; // Success - user is authenticated and has admin role
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    }, { status: 401 });
  }

  return null; // Success - user is authenticated
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as any).role === 'admin';
}
