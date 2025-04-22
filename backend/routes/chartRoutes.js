import { Router } from 'express';
const router = Router();
import ChartData from '../models/ChartData.js';

router.get('/:type', async (req, res) => {
  try {
    const chart = await ChartData.findOne({ type: req.params.type });
    if (!chart) return res.status(404).json({ error: 'Chart data not found' });
    res.json(chart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;