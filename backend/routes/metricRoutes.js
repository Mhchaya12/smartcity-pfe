import { Router } from 'express';
const router = Router();
import Metrics from '../models/Metrics.js';

router.get('/', async (req, res) => {
  try {
    const metrics = await Metrics.find();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;