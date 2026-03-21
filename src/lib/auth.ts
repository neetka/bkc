import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession();

  // Check if session exists
  if (!session) {
    return NextResponse.json({
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    }, { status: 401 });
  }

  // Check if user has admin role
  if (!session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({
      error: 'Insufficient permissions',
      message: 'Admin access required'
    }, { status: 403 });
  }

  return null; // Success - user is authenticated and has admin role
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    }, { status: 401 });
  }

  return null; // Success - user is authenticated
}

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}

export async function isAdmin() {
  const session = await getServerSession();
  return session?.user && (session.user as any).role === 'admin';
}
