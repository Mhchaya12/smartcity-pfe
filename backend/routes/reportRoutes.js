import { Router } from 'express';
const router = Router();
import Report from '../models/Report.js';

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const report = new Report({
      id: `R${require('uuid').v4().slice(0, 3)}`,
      ...req.body,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;