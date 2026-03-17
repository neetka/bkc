import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const { orderedIds } = await request.json();
    
    const bulkOps = orderedIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));
    
    await GalleryImage.bulkWrite(bulkOps);
    return NextResponse.json({ message: 'Reorder successful' });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    return NextResponse.json({ error: 'Failed to reorder gallery' }, { status: 500 });
  }
}
