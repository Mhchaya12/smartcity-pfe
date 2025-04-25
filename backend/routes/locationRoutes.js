import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Location from '../models/Location.js';

const router = Router();

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findOne({ id: req.params.id });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new location
router.post('/', async (req, res) => {
  try {
    const location = new Location({
      id: `loc-${uuidv4().slice(0, 8)}`,
      ...req.body
    });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update location
router.put('/:id', async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findOneAndDelete({ id: req.params.id });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
