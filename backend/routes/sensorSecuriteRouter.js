import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import data from '../data copy/mockData.js';
import SensorSecurite from '../models/sensorSecuriteModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des capteurs de sécurité
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Starting seed process for SensorSecurite...');
    await SensorSecurite.deleteMany({});
    console.log('Previous SensorSecurite deleted');
    const createdSensors = await SensorSecurite.insertMany(data.sensors.filter(sensor => sensor.type === 'SECURITE'));
    console.log('SensorSecurite created:', createdSensors);
    res.send({ createdSensors });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer un capteur de sécurité
router.post('/', expressAsyncHandler(async (req, res) => {
  const sensor = new SensorSecurite(req.body);
  await sensor.save();
  res.status(201).json(sensor);
}));

// Lire tous les capteurs de sécurité
router.get('/', expressAsyncHandler(async (req, res) => {
  const sensors = await SensorSecurite.find();
  res.json(sensors);
}));

// Lire un capteur de sécurité par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorSecurite.findById(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de sécurité non trouvé' });
  }
  res.json(sensor);
}));

// Mettre à jour un capteur de sécurité
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorSecurite.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de sécurité non trouvé' });
  }
  res.json(sensor);
}));

// Supprimer un capteur de sécurité
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorSecurite.findByIdAndDelete(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de sécurité non trouvé' });
  }
  res.json({ message: 'Capteur de sécurité supprimé' });
}));

export default router; 