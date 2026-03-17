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
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const alt = formData.get('alt') as string || '';
    const caption = formData.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Write file to temp location
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}-${file.name}`);
    await writeFile(tmpPath, buffer);

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(tmpPath);

    // Clean up temp file
    await unlink(tmpPath);

    // Save to database
    const count = await GalleryImage.countDocuments();
    const galleryImage = await GalleryImage.create({
      src: url,
      alt,
      caption,
      publicId,
      order: count,
    });

    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
