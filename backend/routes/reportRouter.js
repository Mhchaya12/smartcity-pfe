import express from 'express';
import Report from '../models/reportModel.js';

const router = express.Router();

// Créer un rapport
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lire tous les rapports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lire un rapport par ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un rapport
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un rapport
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }
    res.json({ message: 'Rapport supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 