import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bulletin from '@/models/Bulletin';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const bulletins = await Bulletin.find({}).sort({ date: -1 });
    return NextResponse.json(bulletins);
  } catch (error: any) {
    console.error('Error fetching bulletins:', error);

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return NextResponse.json({
        error: 'Database connection failed. Please try again later.'
      }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to fetch bulletins' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.date) {
      return NextResponse.json({ error: 'Title, description, and date are required' }, { status: 400 });
    }

    const bulletin = await Bulletin.create(body);
    return NextResponse.json(bulletin, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bulletin:', error);

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return NextResponse.json({
        error: 'Database connection failed. Please try again later.'
      }, { status: 503 });
    }

    // Check for validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        error: 'Invalid data provided',
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create bulletin' }, { status: 500 });
  }
}
