import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import data from '../data copy/mockData.js';
import SensorEnergie from '../models/sensorEnergieModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des capteurs d'énergie
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Starting seed process for SensorEnergie...');
    await SensorEnergie.deleteMany({});
    console.log('Previous SensorEnergie deleted');
    const createdSensors = await SensorEnergie.insertMany(data.sensors.filter(sensor => sensor.type === 'ENERGIE'));
    console.log('SensorEnergie created:', createdSensors);
    res.send({ createdSensors });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer un capteur d'énergie
router.post('/', expressAsyncHandler(async (req, res) => {
  const sensor = new SensorEnergie(req.body);
  await sensor.save();
  res.status(201).json(sensor);
}));

// Lire tous les capteurs d'énergie
router.get('/', expressAsyncHandler(async (req, res) => {
  const sensors = await SensorEnergie.find();
  res.json(sensors);
}));

// Lire un capteur d'énergie par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorEnergie.findById(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur d\'énergie non trouvé' });
  }
  res.json(sensor);
}));

// Mettre à jour un capteur d'énergie
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorEnergie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur d\'énergie non trouvé' });
  }
  res.json(sensor);
}));

// Supprimer un capteur d'énergie
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorEnergie.findByIdAndDelete(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur d\'énergie non trouvé' });
  }
  res.json({ message: 'Capteur d\'énergie supprimé' });
}));

export default router; 