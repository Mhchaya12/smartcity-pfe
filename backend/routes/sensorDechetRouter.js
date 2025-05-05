import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import data from '../data copy/mockData.js';
import SensorDechet from '../models/sensorDechetModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des capteurs de déchet
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Starting seed process for SensorDechet...');
    await SensorDechet.deleteMany({});
    console.log('Previous SensorDechet deleted');
    const createdSensors = await SensorDechet.insertMany(data.sensors.filter(sensor => sensor.type === 'DECHET'));
    console.log('SensorDechet created:', createdSensors);
    res.send({ createdSensors });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer un capteur de déchet
router.post('/', expressAsyncHandler(async (req, res) => {
  const sensor = new SensorDechet(req.body);
  await sensor.save();
  res.status(201).json(sensor);
}));

// Lire tous les capteurs de déchet
router.get('/', expressAsyncHandler(async (req, res) => {
  const sensors = await SensorDechet.find();
  res.json(sensors);
}));

// Lire un capteur de déchet par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorDechet.findById(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de déchet non trouvé' });
  }
  res.json(sensor);
}));

// Mettre à jour un capteur de déchet
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorDechet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de déchet non trouvé' });
  }
  res.json(sensor);
}));

// Supprimer un capteur de déchet
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorDechet.findByIdAndDelete(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de déchet non trouvé' });
  }
  res.json({ message: 'Capteur de déchet supprimé' });
}));

export default router; 