import { Router } from 'express';
import dbConnect from '../lib/mongodb';
import Service from '../models/Service';
import { requireAdmin } from '../lib/auth';

const router = Router();

// GET /api/services — public
router.get('/', async (_req, res) => {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ order: 1 });
    return res.json(services);
  } catch (error) {
    console.error('[SERVICES] Error fetching:', error);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// POST /api/services — admin
router.post('/', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const body = req.body;

    if (!body.title || !body.description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const count = await Service.countDocuments();
    const service = await Service.create({ ...body, order: count });
    return res.status(201).json(service);
  } catch (error) {
    console.error('[SERVICES] Error creating:', error);
    return res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT /api/services/reorder — admin (must be before /:id)
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

    await Service.bulkWrite(bulkOps);
    return res.json({ message: 'Reorder successful' });
  } catch (error) {
    console.error('[SERVICES] Error reordering:', error);
    return res.status(500).json({ error: 'Failed to reorder services' });
  }
});

// PUT /api/services/:id — admin
router.put('/:id', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json(service);
  } catch (error) {
    console.error('[SERVICES] Error updating:', error);
    return res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE /api/services/:id — admin
router.delete('/:id', requireAdmin as any, async (req, res) => {
  try {
    await dbConnect();
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('[SERVICES] Error deleting:', error);
    return res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
