import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import dbConnect from '../lib/mongodb';
import GalleryImage from '../models/GalleryImage';
import { requireAdmin } from '../lib/auth';
import { uploadImage, deleteImage } from '../lib/cloudinary';

const router = Router();

// Configure multer for temp file uploads
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// GET /api/gallery — public
router.get('/', async (_req, res) => {
  try {
    await dbConnect();
    const images = await GalleryImage.find({}).sort({ order: 1 });
    return res.json(images);
  } catch (error: any) {
    console.error('[GALLERY] Error fetching:', error);
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ error: 'Database connection failed.' });
    }
    return res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST /api/gallery — admin (with file upload)
router.post('/', requireAdmin as any, upload.single('image'), async (req: any, res) => {
  let tmpPath: string | null = null;

  try {
    await dbConnect();
    const file = req.file;
    const alt = (req.body.alt || '').trim();
    const caption = (req.body.caption || '').trim();

    if (!file) {
      return res.status(400).json({ error: 'Missing image file' });
    }

    tmpPath = file.path;
    console.log(`📤 Uploading image: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(tmpPath!);

    // Clean up temp file
    await fs.unlink(tmpPath!);
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

    console.log(`✅ Image uploaded: ${galleryImage._id}`);
    return res.status(201).json({ success: true, message: 'Image uploaded', data: galleryImage });
  } catch (error: any) {
    console.error('[GALLERY] Error uploading:', error);

    if (tmpPath) {
      try { await fs.unlink(tmpPath); } catch (_) { /* ignore */ }
    }

    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ error: 'Database connection failed' });
    }
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// PUT /api/gallery/reorder — admin (must be before /:id)
router.put('/reorder', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const { orderedIds } = req.body;

    const bulkOps = orderedIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    await GalleryImage.bulkWrite(bulkOps);
    return res.json({ message: 'Reorder successful' });
  } catch (error) {
    console.error('[GALLERY] Error reordering:', error);
    return res.status(500).json({ error: 'Failed to reorder gallery' });
  }
});

// PUT /api/gallery/:id — admin
router.put('/:id', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { alt: req.body.alt, caption: req.body.caption },
      { new: true }
    );
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    return res.json(image);
  } catch (error) {
    console.error('[GALLERY] Error updating:', error);
    return res.status(500).json({ error: 'Failed to update image' });
  }
});

// DELETE /api/gallery/:id — admin
router.delete('/:id', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    return res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('[GALLERY] Error deleting:', error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
