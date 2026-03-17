import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
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
    
    await Service.bulkWrite(bulkOps);
    return NextResponse.json({ message: 'Reorder successful' });
  } catch (error) {
    console.error('Error reordering services:', error);
    return NextResponse.json({ error: 'Failed to reorder services' }, { status: 500 });
  }
}
