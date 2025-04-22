import { Router } from 'express';
const router = Router();
import Config  from '../models/Config.js';

router.get('/', async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', async (req, res) => {
  try {
    const config = await findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;