import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bulletin from '@/models/Bulletin';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const bulletins = await Bulletin.find({}).sort({ date: -1 });
    return NextResponse.json(bulletins);
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    return NextResponse.json({ error: 'Failed to fetch bulletins' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();
    const bulletin = await Bulletin.create(body);
    return NextResponse.json(bulletin, { status: 201 });
  } catch (error) {
    console.error('Error creating bulletin:', error);
    return NextResponse.json({ error: 'Failed to create bulletin' }, { status: 500 });
  }
}
