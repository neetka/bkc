// Example usage of improved authentication functions

import { requireAdmin, requireAuth, getCurrentUser, isAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Example 1: Admin-only API route
export async function POST(request: NextRequest) {
  // This will return 401 if not logged in, 403 if not admin
  const authError = await requireAdmin();
  if (authError) return authError;

  // User is authenticated and has admin role
  // Proceed with admin-only logic
  return NextResponse.json({ message: 'Admin action completed' });
}

// Example 2: Authenticated user route (any role)
export async function GET(request: NextRequest) {
  // This will return 401 if not logged in
  const authError = await requireAuth();
  if (authError) return authError;

  // User is authenticated (could be any role)
  const user = await getCurrentUser();
  return NextResponse.json({ user: user?.name });
}

// Example 3: Conditional logic based on admin status
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  const adminStatus = await isAdmin();

  if (adminStatus) {
    // Admin can do anything
    return NextResponse.json({ message: 'Admin update completed' });
  } else if (user) {
    // Authenticated user can do limited updates
    return NextResponse.json({ message: 'User update completed' });
  } else {
    // Not authenticated
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}

// Example 4: Public route with optional authentication
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();

  if (user) {
    // Authenticated user gets enhanced features
    return NextResponse.json({ message: 'Enhanced feature for authenticated users' });
  } else {
    // Public access with limited features
    return NextResponse.json({ message: 'Basic feature for public users' });
  }
}