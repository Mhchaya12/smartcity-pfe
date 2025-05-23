import { Server } from 'socket.io';
import SensorSecurite from '../models/sensorSecuriteModel.js';
import SensorTransport from '../models/sensorTransportModel.js';
import SensorDechet from '../models/sensorDechetModel.js';
import SensorEnergie from '../models/sensorEnergieModel.js';
import AlertMaintenanceService from './alertMaintenanceService.js';

let io;
let alertMaintenanceService;

export const initializeSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Initialiser le service d'alertes et de maintenance avec l'instance Socket.IO
  alertMaintenanceService = new AlertMaintenanceService(io);

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Vérifier les données existantes et créer des alertes/maintenances
  alertMaintenanceService.checkExistingDataAndCreateAlerts().then(() => {
    console.log('Starting sensor data generation...');
    startSensorDataGeneration();
  }).catch(error => {
    console.error('Error checking existing data:', error);
  });

  return io;
};

const generateRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getStatusBasedOnValue = (value, sensorType) => {
  const thresholds = {
    SensorSecurite: { critical: 15, warning: 8, maintenance: 0 },
    SensorTransport: { critical: 350, warning: 200, maintenance: 50 },
    SensorDechet: { critical: 90, warning: 70, maintenance: 10 },
    SensorEnergie: { critical: 5800, warning: 4500, maintenance: 300 }
  };

  const threshold = thresholds[sensorType];
  if (value >= threshold.critical) return 'critical';
  if (value >= threshold.warning) return 'warning';
  if (value <= threshold.maintenance) return 'maintenance';
  return 'operational';
};

const updateSensorData = async (Model, sensorType) => {
  try {
    const sensor = await Model.findOne();
    if (!sensor) {
      console.log(`No sensor found for ${sensorType}, creating new one...`);
      const newSensor = new Model({
        localisation: 'Default Location',
        status: 'operational',
        pourcentage: 0,
        dernier_mise_a_jour: new Date()
      });
      await newSensor.save();
      return;
    }

    const newValue = generateRandomValue(0, 100);
    sensor.pourcentage = newValue;
    sensor.status = getStatusBasedOnValue(newValue, sensorType);
    sensor.dernier_mise_a_jour = new Date();
    
    const updatedSensor = await sensor.save();
    if (updatedSensor && alertMaintenanceService) {
      // Traiter les alertes et maintenances
      await alertMaintenanceService.processSensorData(updatedSensor, sensorType);
      // Émettre la mise à jour du capteur
      io.emit(`update${sensorType}`, updatedSensor);
    }
  } catch (error) {
    console.error(`Error updating ${sensorType}:`, error);
  }
};

const startSensorDataGeneration = () => {
  setInterval(async () => {
    await updateSensorData(SensorSecurite, 'SensorSecurite');
    await updateSensorData(SensorTransport, 'SensorTransport');
    await updateSensorData(SensorDechet, 'SensorDechet');
    await updateSensorData(SensorEnergie, 'SensorEnergie');
  }, 10000); // Update every 10 seconds
}; 