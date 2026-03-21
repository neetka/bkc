import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('[SERVICES] PUT /api/services/[id] — request received');

  const authError = await requireAdmin();
  if (authError) {
    console.log('[SERVICES] ❌ Auth failed for PUT');
    return authError;
  }

  try {
    await dbConnect();
    console.log('[SERVICES] ✅ DB connected');

    const { id } = await params;
    console.log('[SERVICES] Updating service ID:', id);

    const body = await request.json();
    console.log('[SERVICES] Request body:', JSON.stringify(body));

    const service = await Service.findByIdAndUpdate(id, body, { new: true });
    if (!service) {
      console.log('[SERVICES] ❌ Service not found:', id);
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    console.log('[SERVICES] ✅ Service updated:', service._id);
    return NextResponse.json(service);
  } catch (error) {
    console.error('[SERVICES] ❌ Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('[SERVICES] DELETE /api/services/[id] — request received');

  const authError = await requireAdmin();
  if (authError) {
    console.log('[SERVICES] ❌ Auth failed for DELETE');
    return authError;
  }

  try {
    await dbConnect();
    console.log('[SERVICES] ✅ DB connected');

    const { id } = await params;
    console.log('[SERVICES] Deleting service ID:', id);

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      console.log('[SERVICES] ❌ Service not found:', id);
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    console.log('[SERVICES] ✅ Service deleted:', id);
    return NextResponse.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('[SERVICES] ❌ Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
