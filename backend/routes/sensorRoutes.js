import { Router } from 'express';
import Sensor from '../models/Sensor.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findOne({ id: req.params.id });
    if (!sensor) return res.status(404).json({ error: 'Sensor not found' });
    res.json(sensor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;