import { Router } from 'express';
import bcrypt from 'bcryptjs';
import dbConnect from '../lib/mongodb';
import Admin from '../models/Admin';
import { generateToken, requireAuth, AuthRequest } from '../lib/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    await dbConnect();
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken({
      id: admin._id.toString(),
      username: admin.username,
      role: 'admin',
    });

    console.log(`✅ Login successful for user: ${admin.username}`);
    return res.json({
      token,
      user: {
        id: admin._id.toString(),
        name: admin.username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth as any, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: req.user });
});

export default router;
