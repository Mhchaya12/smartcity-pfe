import { Router } from 'express';
const router = Router();
import MaintenanceTask from '../models/MaintenanceTask.js';

router.get('/', async (req, res) => {
  try {
    const tasks = await MaintenanceTask.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = new MaintenanceTask({
      id: `m${require('uuid').v4().slice(0, 3)}`,
      ...req.body
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;