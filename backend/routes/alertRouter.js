import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import data from '../data copy/mockData.js';
import Alert from '../models/alertModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des alertes
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Starting seed process for Alert...');
    await Alert.deleteMany({});
    console.log('Previous Alert deleted');
    const createdAlerts = await Alert.insertMany(data.alerts);
    console.log('Alert created:', createdAlerts);
    res.send({ createdAlerts });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer une alerte
router.post('/', expressAsyncHandler(async (req, res) => {
  const alert = new Alert(req.body);
  await alert.save();
  res.status(201).json(alert);
}));

// Lire toutes les alertes
router.get('/', expressAsyncHandler(async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
}));

// Lire une alerte par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) {
    return res.status(404).json({ message: 'Alerte non trouvée' });
  }
  res.json(alert);
}));

// Mettre à jour une alerte
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!alert) {
    return res.status(404).json({ message: 'Alerte non trouvée' });
  }
  res.json(alert);
}));

// Supprimer une alerte
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndDelete(req.params.id);
  if (!alert) {
    return res.status(404).json({ message: 'Alerte non trouvée' });
  }
  res.json({ message: 'Alerte supprimée' });
}));

export default router; 