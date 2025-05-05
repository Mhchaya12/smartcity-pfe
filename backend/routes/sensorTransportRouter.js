import express from 'express';
import expressAsyncHandler from 'express-async-handler';
// import data from '../data copy/mockData.js';
import SensorTransport from '../models/sensorTransportModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des capteurs de transport
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Starting seed process for SensorTransport...');
    await SensorTransport.deleteMany({});
    console.log('Previous SensorTransport deleted');
    const createdSensors = await SensorTransport.insertMany(data.sensors.filter(sensor => sensor.type === 'TRANSPORT'));
    console.log('SensorTransport created:', createdSensors);
    res.send({ createdSensors });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer un capteur de transport
router.post('/', expressAsyncHandler(async (req, res) => {
  const sensor = new SensorTransport(req.body);
  await sensor.save();
  res.status(201).json(sensor);
}));

// Lire tous les capteurs de transport
router.get('/', expressAsyncHandler(async (req, res) => {
  const sensors = await SensorTransport.find();
  res.json(sensors);
}));

// Lire un capteur de transport par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorTransport.findById(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de transport non trouvé' });
  }
  res.json(sensor);
}));

// Mettre à jour un capteur de transport
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorTransport.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de transport non trouvé' });
  }
  res.json(sensor);
}));

// Supprimer un capteur de transport
router.delete('/:id', expressAsyncHandler(async (req, res) => {
  const sensor = await SensorTransport.findByIdAndDelete(req.params.id);
  if (!sensor) {
    return res.status(404).json({ message: 'Capteur de transport non trouvé' });
  }
  res.json({ message: 'Capteur de transport supprimé' });
}));

export default router; 