import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Configuration from '../models/configurationModel.js';

const router = express.Router();

// Créer une configuration
router.post('/', expressAsyncHandler(async (req, res) => {
  const configuration = new Configuration(req.body);
  await configuration.save();
  res.status(201).json(configuration);
}));

// Lire toutes les configurations
router.get('/', expressAsyncHandler(async (req, res) => {
  const configurations = await Configuration.find();
  res.json(configurations);
}));

// Lire une configuration par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);
  if (!configuration) {
    return res.status(404).json({ message: 'Configuration non trouvée' });
  }
  res.json(configuration);
}));

// Mettre à jour une configuration
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const configuration = await Configuration.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!configuration) {
    return res.status(404).json({ message: 'Configuration non trouvée' });
  }
  res.json(configuration);
}));

// Supprimer une configuration
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const configuration = await Configuration.findByIdAndDelete(req.params.id);
  if (!configuration) {
    return res.status(404).json({ message: 'Configuration non trouvée' });
  }
  res.json({ message: 'Configuration supprimée' });
}));

// Récupérer l'historique des configurations
router.get('/historique', expressAsyncHandler(async (req, res) => {
  const configurations = await Configuration.find().sort({ date: -1 });
  res.json(configurations);
}));

export default router; 