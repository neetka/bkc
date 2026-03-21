import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  console.log('[SERVICES] GET /api/services — request received');
  try {
    await dbConnect();
    console.log('[SERVICES] ✅ DB connected');
    const services = await Service.find({}).sort({ order: 1 });
    console.log('[SERVICES] ✅ Fetched', services.length, 'services');
    return NextResponse.json(services);
  } catch (error) {
    console.error('[SERVICES] ❌ Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('[SERVICES] POST /api/services — request received');

  const authError = await requireAdmin();
  if (authError) {
    console.log('[SERVICES] ❌ Auth failed for POST');
    return authError;
  }

  try {
    await dbConnect();
    console.log('[SERVICES] ✅ DB connected');

    const body = await request.json();
    console.log('[SERVICES] Request body:', JSON.stringify(body));

    // Validate required fields
    if (!body.title || !body.description) {
      console.log('[SERVICES] ❌ Validation failed — missing title or description');
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const count = await Service.countDocuments();
    const service = await Service.create({ ...body, order: count });
    console.log('[SERVICES] ✅ Created service:', service._id);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('[SERVICES] ❌ Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
