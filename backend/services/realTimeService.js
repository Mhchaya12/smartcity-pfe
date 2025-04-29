import { schedule } from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';
import ChartData from '../models/ChartData.js';
import MaintenanceTask from '../models/MaintenanceTask.js';
import Config from '../models/Config.js';
import Metric from '../models/Metric.js';
import { generateSensorData } from '../utils/generateSensorData.js';
import { sendNotification } from './notificationService.js';

const startRealTimeUpdates = (io) => {
  // Mise à jour toutes les 10 secondes
  schedule('*/10 * * * * *', async () => {
    try {
      const sensors = await Sensor.find();
      const config = await Config.findOne() || {
        energy: { threshold: 500, checkFrequency: 300 },
        waste: { threshold: 80, checkFrequency: 3600 },
        transport: { threshold: 3500, checkFrequency: 300 },
        security: { threshold: 3, checkFrequency: 60 }
      };

      const updatedSensors = [];
      const newAlerts = [];
      const newMaintenanceTasks = [];

      // Mise à jour des capteurs avec données simulées
      for (const sensor of sensors) {
        const newSensorData = generateSensorData();
        
        const updatedSensor = {
          ...sensor._doc,
          value: newSensorData.value,
          status: newSensorData.status,
          location: newSensorData.location,
          batteryLevel: newSensorData.batteryLevel,
          maintenanceRequired: newSensorData.maintenanceRequired,
          lastUpdate: new Date()
        };
        
        updatedSensors.push(updatedSensor);
        await Sensor.updateOne({ _id: sensor._id }, updatedSensor);

        // Générer une alerte si le statut est warning
        if (newSensorData.status === 'warning') {
          const alert = new Alert({
            id: `A${uuidv4().slice(0, 3)}`,
            type: 'warning',
            message: `${sensor.type} seuil dépassé: ${newSensorData.value} ${newSensorData.unit}`,
            location: newSensorData.location,
            timestamp: new Date(),
            sensorId: sensor.id,
            resolved: false
          });
          await alert.save();
          newAlerts.push(alert);
        }

        // Générer une tâche de maintenance si nécessaire
        if (newSensorData.maintenanceRequired) {
          const maintenanceTask = new MaintenanceTask({
            id: `M${uuidv4().slice(0, 3)}`,
            sensorId: sensor.id,
            sensorName: `${sensor.type} - ${JSON.stringify(newSensorData.location)}`,
            taskType: 'maintenance',
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
            priority: newSensorData.status === 'warning' ? 'high' : 'medium',
            status: 'pending',
            notes: `Maintenance requise - Niveau de batterie: ${newSensorData.batteryLevel}%`
          });
          await maintenanceTask.save();
          newMaintenanceTasks.push(maintenanceTask);
        }
      }

      // Mise à jour des métriques en temps réel
      const metricsByType = {};
      updatedSensors.forEach(sensor => {
        if (!metricsByType[sensor.type]) {
          metricsByType[sensor.type] = [];
        }
        metricsByType[sensor.type].push(sensor.value);
      });

      // Calculer et sauvegarder les nouvelles métriques
      for (const [type, values] of Object.entries(metricsByType)) {
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const metric = new Metric({
          type,
          value: Math.round(avgValue),
          unit: type === 'ENERGIE' ? 'kWh' :
                type === 'DECHET' ? '%' :
                type === 'TRANSPORT' ? 'véh/h' : 'incidents',
          timestamp: new Date()
        });
        await metric.save();
      }

      // Émettre les mises à jour via Socket.IO
      io.emit('sensorsUpdate', updatedSensors);
      if (newAlerts.length > 0) io.emit('alertsUpdate', newAlerts);
      if (newMaintenanceTasks.length > 0) io.emit('maintenanceUpdate', newMaintenanceTasks);

    } catch (error) {
      console.error('Erreur lors de la mise à jour en temps réel:', error);
    }
  });
};

export { startRealTimeUpdates };
