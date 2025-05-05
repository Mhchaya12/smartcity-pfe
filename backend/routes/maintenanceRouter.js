import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import data from '../data copy/mockData.js';
import Maintenance from '../models/maintenanceModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des tâches de maintenance
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Starting seed process for Maintenance...');
    await Maintenance.deleteMany({});
    console.log('Previous Maintenance deleted');
    const createdMaintenances = await Maintenance.insertMany(data.maintenanceTasks);
    console.log('Maintenance created:', createdMaintenances);
    res.send({ createdMaintenances });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer une tâche de maintenance
router.post('/', expressAsyncHandler(async (req, res) => {
  const maintenance = new Maintenance(req.body);
  await maintenance.save();
  res.status(201).json(maintenance);
}));

// Lire toutes les tâches de maintenance
router.get('/', expressAsyncHandler(async (req, res) => {
  const maintenances = await Maintenance.find();
  res.json(maintenances);
}));

// Lire une tâche de maintenance par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id);
  if (!maintenance) {
    return res.status(404).json({ message: 'Tâche de maintenance non trouvée' });
  }
  res.json(maintenance);
}));

// Mettre à jour une tâche de maintenance
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!maintenance) {
    return res.status(404).json({ message: 'Tâche de maintenance non trouvée' });
  }
  res.json(maintenance);
}));

// Supprimer une tâche de maintenance
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
  if (!maintenance) {
    return res.status(404).json({ message: 'Tâche de maintenance non trouvée' });
  }
  res.json({ message: 'Tâche de maintenance supprimée' });
}));

export default router; 