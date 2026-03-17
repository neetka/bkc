import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bulletin from '@/models/Bulletin';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const bulletin = await Bulletin.findByIdAndUpdate(id, body, { new: true });
    if (!bulletin) {
      return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
    }
    return NextResponse.json(bulletin);
  } catch (error) {
    console.error('Error updating bulletin:', error);
    return NextResponse.json({ error: 'Failed to update bulletin' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const { id } = await params;
    const bulletin = await Bulletin.findByIdAndDelete(id);
    if (!bulletin) {
      return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Bulletin deleted' });
  } catch (error) {
    console.error('Error deleting bulletin:', error);
    return NextResponse.json({ error: 'Failed to delete bulletin' }, { status: 500 });
  }
}
