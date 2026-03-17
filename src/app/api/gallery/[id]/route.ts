import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';
import { requireAdmin } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const image = await GalleryImage.findByIdAndUpdate(id, { alt: body.alt, caption: body.caption }, { new: true });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();
    const { id } = await params;
    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from Cloudinary if it has a publicId
    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
