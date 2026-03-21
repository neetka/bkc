import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bulletin from '@/models/Bulletin';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('[BULLETINS] PUT /api/bulletins/[id] — request received');

  const authError = await requireAdmin();
  if (authError) {
    console.log('[BULLETINS] ❌ Auth failed for PUT');
    return authError;
  }

  try {
    await dbConnect();
    console.log('[BULLETINS] ✅ DB connected');

    const { id } = await params;
    console.log('[BULLETINS] Updating bulletin ID:', id);

    const body = await request.json();
    console.log('[BULLETINS] Request body:', JSON.stringify(body));

    const bulletin = await Bulletin.findByIdAndUpdate(id, body, { new: true });
    if (!bulletin) {
      console.log('[BULLETINS] ❌ Bulletin not found:', id);
      return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
    }

    console.log('[BULLETINS] ✅ Bulletin updated:', bulletin._id);
    return NextResponse.json(bulletin);
  } catch (error) {
    console.error('[BULLETINS] ❌ Error updating bulletin:', error);
    return NextResponse.json({ error: 'Failed to update bulletin' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('[BULLETINS] DELETE /api/bulletins/[id] — request received');

  const authError = await requireAdmin();
  if (authError) {
    console.log('[BULLETINS] ❌ Auth failed for DELETE');
    return authError;
  }

  try {
    await dbConnect();
    console.log('[BULLETINS] ✅ DB connected');

    const { id } = await params;
    console.log('[BULLETINS] Deleting bulletin ID:', id);

    const bulletin = await Bulletin.findByIdAndDelete(id);
    if (!bulletin) {
      console.log('[BULLETINS] ❌ Bulletin not found:', id);
      return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
    }

    console.log('[BULLETINS] ✅ Bulletin deleted:', id);
    return NextResponse.json({ message: 'Bulletin deleted' });
  } catch (error) {
    console.error('[BULLETINS] ❌ Error deleting bulletin:', error);
    return NextResponse.json({ error: 'Failed to delete bulletin' }, { status: 500 });
  }
}
