import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';
import { requireAdmin } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';

export async function GET() {
  try {
    await dbConnect();
    const images = await GalleryImage.find({}).sort({ order: 1 });
    return NextResponse.json(images);
  } catch (error: any) {
    console.error('Error fetching gallery:', error);

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return NextResponse.json({
        error: 'Database connection failed. Please try again later.'
      }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let tmpPath: string | null = null;

  try {
    await dbConnect();
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const alt = (formData.get('alt') as string)?.trim() || '';
    const caption = (formData.get('caption') as string)?.trim() || '';

    if (!file) {
      return NextResponse.json({
        error: 'Missing image file',
        message: 'Please provide an image file to upload'
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        error: 'Invalid file type',
        message: 'Only image files are allowed'
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large',
        message: 'Image file must be less than 10MB'
      }, { status: 400 });
    }

    console.log(`📤 Uploading image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Write file to temp location
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}-${file.name}`);
    await writeFile(tmpPath, buffer);

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(tmpPath);

    // Clean up temp file
    await unlink(tmpPath);
    tmpPath = null;

    // Save to database
    const count = await GalleryImage.countDocuments();
    const galleryImage = await GalleryImage.create({
      src: url,
      alt,
      caption,
      publicId,
      order: count,
    });

    console.log(`✅ Image uploaded successfully: ${galleryImage._id}`);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: galleryImage
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error uploading gallery image:', error);

    // Clean up temp file if it exists
    if (tmpPath) {
      try {
        await unlink(tmpPath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return NextResponse.json({
        error: 'Database connection failed',
        message: 'Please try again later'
      }, { status: 503 });
    }

    // Check for validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        error: 'Validation failed',
        message: 'Invalid data provided',
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Upload failed',
      message: 'An unexpected error occurred during upload'
    }, { status: 500 });
  }
}
