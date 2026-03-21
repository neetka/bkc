import { Router } from 'express';
import dbConnect from '../lib/mongodb';
import Submission from '../models/Submission';
import { requireAdmin } from '../lib/auth';

const router = Router();

// GET /api/submissions — admin only
router.get('/', requireAdmin as any, async (_req, res) => {
  try {
    await dbConnect();
    const submissions = await Submission.find({}).sort({ createdAt: -1 });
    return res.json(submissions);
  } catch (error) {
    console.error('[SUBMISSIONS] Error fetching:', error);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// POST /api/submissions — public
router.post('/', async (req, res) => {
  try {
    await dbConnect();
    const body = req.body;

    if (!body.type || !body.name || !body.email || !body.phone) {
      return res.status(400).json({ error: 'Type, name, email, and phone are required' });
    }

    if (!['enquiry', 'join'].includes(body.type)) {
      return res.status(400).json({ error: 'Invalid type. Must be enquiry or join' });
    }

    const submission = await Submission.create(body);
    return res.status(201).json(submission);
  } catch (error) {
    console.error('[SUBMISSIONS] Error creating:', error);
    return res.status(500).json({ error: 'Failed to create submission' });
  }
});

export default router;
