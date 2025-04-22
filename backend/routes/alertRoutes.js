import { Router } from 'express';

import Alert from '../models/Alert.js';
const router = Router();
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { id: req.params.id },
      { resolved: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;