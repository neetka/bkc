import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  console.log('[AUTH] requireAdmin() called (backend/lib/auth.ts)');
  const session = await getServerSession(authOptions);
  console.log('[AUTH] Session:', JSON.stringify(session));

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    console.log('[AUTH] ❌ Unauthorized - no admin session found');
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  console.log('[AUTH] ✅ Admin access granted');
  return null;
}
