import express from 'express';
import SystemUrbain from '../models/systemUrbainModel.js';

const router = express.Router();

// Créer un système urbain
router.post('/', async (req, res) => {
  try {
    const systemUrbain = new SystemUrbain(req.body);
    await systemUrbain.save();
    res.status(201).json(systemUrbain);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lire tous les systèmes urbains
router.get('/', async (req, res) => {
  try {
    const systemUrbains = await SystemUrbain.find();
    res.json(systemUrbains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lire un système urbain par ID
router.get('/:id', async (req, res) => {
  try {
    const systemUrbain = await SystemUrbain.findById(req.params.id);
    if (!systemUrbain) {
      return res.status(404).json({ message: 'Système urbain non trouvé' });
    }
    res.json(systemUrbain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un système urbain
router.put('/:id', async (req, res) => {
  try {
    const systemUrbain = await SystemUrbain.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!systemUrbain) {
      return res.status(404).json({ message: 'Système urbain non trouvé' });
    }
    res.json(systemUrbain);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un système urbain
router.delete('/:id', async (req, res) => {
  try {
    const systemUrbain = await SystemUrbain.findByIdAndDelete(req.params.id);
    if (!systemUrbain) {
      return res.status(404).json({ message: 'Système urbain non trouvé' });
    }
    res.json({ message: 'Système urbain supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 