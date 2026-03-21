import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }
  return null;
}
