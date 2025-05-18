import { Server } from 'socket.io';
import SensorSecurite from '../models/sensorSecuriteModel.js';
import SensorTransport from '../models/sensorTransportModel.js';
import SensorDechet from '../models/sensorDechetModel.js';
import SensorEnergie from '../models/sensorEnergieModel.js';
import Alert from '../models/alertModel.js';
import Maintenance from '../models/maintenanceModel.js';

let io;

export const initializeSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  startSensorDataGeneration();
};

const generateRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const checkAndCreateAlert = async (sensorData, sensorType) => {
  if (sensorData.status === 'critical' || sensorData.status === 'warning') {
    const now = new Date();
    const alert = new Alert({
      date: now,
      heure: now.toLocaleTimeString(),
      etat: sensorData.status,
      description: `Capteur ${sensorType} est en statut ${sensorData.status}`,
      local: sensorData.localisation || 'Non spécifié',
      resolu: false,
      sensorId: sensorData._id
    });
    await alert.save();
    io.emit('newAlert', alert);
  }
};

const checkAndCreateMaintenance = async (sensorData, sensorType) => {
  if (sensorData.status === 'maintenance' || sensorData.status === 'offline') {
    const now = new Date();
    const maintenance = new Maintenance({
      sensorId: sensorData._id,
      typeTask: 'Maintenance corrective',
      date: now,
      priorite: sensorData.status === 'offline' ? 'Haute' : 'Moyenne',
      status: 'pending',
      description: `Maintenance requise pour le capteur ${sensorType} - Status: ${sensorData.status}`
    });
    await maintenance.save();
    io.emit('newMaintenance', maintenance);
  }
};

const updateSensorData = async (Model, sensorType) => {
  try {
    const sensor = await Model.findOne();
    if (!sensor) return;

    const newValue = generateRandomValue(0, 100);
    const statuses = ['operational', 'warning', 'critical', 'maintenance', 'offline'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

    sensor.pourcentage = newValue;
    sensor.status = newStatus;
    sensor.dernier_mise_a_jour = new Date();
    await sensor.save();

    await checkAndCreateAlert(sensor, sensorType);
    await checkAndCreateMaintenance(sensor, sensorType);

    io.emit(`update${sensorType}`, sensor);
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