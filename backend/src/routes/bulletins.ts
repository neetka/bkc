import { Router } from 'express';
import dbConnect from '../lib/mongodb';
import Bulletin from '../models/Bulletin';
import { requireAdmin } from '../lib/auth';

const router = Router();

// GET /api/bulletins — public
router.get('/', async (_req, res) => {
  try {
    await dbConnect();
    const bulletins = await Bulletin.find({}).sort({ date: -1 });
    return res.json(bulletins);
  } catch (error: any) {
    console.error('[BULLETINS] Error fetching:', error);
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ error: 'Database connection failed. Please try again later.' });
    }
    return res.status(500).json({ error: 'Failed to fetch bulletins' });
  }
});

// POST /api/bulletins — admin
router.post('/', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const body = req.body;

    if (!body.title || !body.description || !body.date) {
      return res.status(400).json({ error: 'Title, description, and date are required' });
    }

    const bulletin = await Bulletin.create(body);
    return res.status(201).json(bulletin);
  } catch (error: any) {
    console.error('[BULLETINS] Error creating:', error);
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ error: 'Database connection failed.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid data provided', details: error.message });
    }
    return res.status(500).json({ error: 'Failed to create bulletin' });
  }
});

// PUT /api/bulletins/:id — admin
router.put('/:id', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const bulletin = await Bulletin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bulletin) {
      return res.status(404).json({ error: 'Bulletin not found' });
    }
    return res.json(bulletin);
  } catch (error) {
    console.error('[BULLETINS] Error updating:', error);
    return res.status(500).json({ error: 'Failed to update bulletin' });
  }
});

// DELETE /api/bulletins/:id — admin
router.delete('/:id', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const bulletin = await Bulletin.findByIdAndDelete(req.params.id);
    if (!bulletin) {
      return res.status(404).json({ error: 'Bulletin not found' });
    }
    return res.json({ message: 'Bulletin deleted' });
  } catch (error) {
    console.error('[BULLETINS] Error deleting:', error);
    return res.status(500).json({ error: 'Failed to delete bulletin' });
  }
});

export default router;
