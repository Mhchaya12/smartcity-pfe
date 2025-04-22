import { schedule } from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';
import ChartData from '../models/ChartData.js';
import MaintenanceTask from '../models/MaintenanceTask.js';
import Config from '../models/Config.js';
import Metric from '../models/Metric.js'; 
import { generateRandomData } from '../utils/generateSensorData.js';
import  {sendNotification}  from './notificationService.js';

const startRealTimeUpdates = (io) => {
  schedule('*/10 * * * * *', async () => {
    try {
      const sensors = await Sensor.find();
      const config = await Config.findOne() || {
        energy: { threshold: 150, checkFrequency: 300 },
        waste: { threshold: 80, checkFrequency: 3600 },
        transport: { threshold: 400, checkFrequency: 300 },
        security: { checkFrequency: 60 }
      };
      const updatedSensors = [];
      const updatedMetrics = [];
      const updatedChartData = await ChartData.find();
      const newAlerts = [];
      const newMaintenanceTasks = [];

      // Mise à jour des capteurs
      for (const sensor of sensors) {
        const ranges = {
          'Énergie': { min: 50, max: 200 },
          'Transport': { min: 100, max: 600 },
          'Déchets': { min: 0, max: 100 },
          'Sécurité': { min: 0, max: 5 }
        };
        const newValue = generateRandomData(ranges[sensor.type].min, ranges[sensor.type].max);
        const threshold = config[sensor.type.toLowerCase()]?.threshold || sensor.threshold;
        const newStatus = checkSensorStatus(newValue, threshold);

        const updatedSensor = {
          ...sensor._doc,
          value: newValue,
          status: newStatus,
          lastUpdate: new Date()
        };
        updatedSensors.push(updatedSensor);
        await Sensor.updateOne({ _id: sensor._id }, updatedSensor);

        // Générer une alerte si nécessaire
        if (newStatus === 'critical' || newStatus === 'warning') {
          const alert = new Alert({
            id: `A${uuidv4().slice(0, 3)}`,
            type: newStatus === 'critical' ? 'critical' : 'warning',
            message: `${sensor.type} threshold exceeded: ${newValue} ${sensor.unit}`,
            location: sensor.location,
            timestamp: new Date(),
            sensorId: sensor.id,
            resolved: false
          });
          await alert.save();
          newAlerts.push(alert);
          if (newStatus === 'critical') {
            await sendNotification({
              to: 'admin@example.com',
              subject: `Critical Alert: ${sensor.type}`,
              text: alert.message
            });
          }
        }

        // Générer une tâche de maintenance si critique
        if (newStatus === 'critical') {
          const maintenanceTask = new MaintenanceTask({
            id: `m${uuidv4().slice(0, 3)}`,
            sensorId: sensor.id,
            sensorName: `${sensor.type} - ${sensor.location}`,
            taskType: 'repair',
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12),
            priority: 'critical',
            status: 'pending',
            notes: `Critical issue detected: ${newValue} ${sensor.unit}`
          });
          await maintenanceTask.save();
          newMaintenanceTasks.push(maintenanceTask);
        }
      }
      // Mise à jour des métriques
      const metricTypes = ['Énergie', 'Transport', 'Déchets', 'Sécurité'];
      for (const type of metricTypes) {
        const sensorsByType = updatedSensors.filter(s => s.type === type);
        const avgValue = sensorsByType.reduce((sum, s) => sum + s.value, 0) / (sensorsByType.length || 1);
        
        // Find existing metric or create new one
        let metric = await Metric.findOne({ type });
        if (!metric) {
          metric = new Metric({
            type,
            primaryMetric: {
              title: `${type} Metric`,
              value: `${Math.round(avgValue)} ${type === 'Énergie' ? 'kWh' : type === 'Transport' ? 'véh/h' : type === 'Déchets' ? '%' : 'incidents'}`,
              icon: getIcon(type),
              iconClass: getIconClass(type),
              percentage: generateRandomData(-5, 5),
              comparison: '(hier)',
              label: `Moyenne ${type.toLowerCase()}`
            },
            lastUpdated: new Date()
          });
        }

        metric.primaryMetric.value = `${Math.round(avgValue)} ${type === 'Énergie' ? 'kWh' : type === 'Transport' ? 'véh/h' : type === 'Déchets' ? '%' : 'incidents'}`;
        metric.primaryMetric.percentage = generateRandomData(-5, 5);
        metric.lastUpdated = new Date();
        await metric.save();
        updatedMetrics.push(metric);
      }


      // Mise à jour des données de graphiques
      for (const chart of updatedChartData) {
        const sensorsByType = updatedSensors.filter(s => s.type.toLowerCase() === chart.type);
        const newDataPoint = sensorsByType.reduce((sum, s) => sum + s.value, 0) / (sensorsByType.length || 1);
        chart.datasets.forEach(dataset => {
          dataset.data.push(newDataPoint);
          if (dataset.data.length > 6) {
            dataset.data.shift();
            chart.labels.shift();
            chart.labels.push(getNextLabel(chart.type, chart.labels));
          }
        });
        chart.lastUpdated = new Date();
        await chart.save();
      }

      // Émettre les mises à jour
      io.emit('sensorsUpdate', updatedSensors);
      io.emit('metricsUpdate', updatedMetrics);
      io.emit('chartsUpdate', updatedChartData);
      io.emit('alertsUpdate', newAlerts);
      io.emit('maintenanceUpdate', newMaintenanceTasks);

    } catch (error) {
      console.error('Error in real-time update:', error);
    }
  });
};

const checkSensorStatus = (value, threshold) => {
  if (value > threshold * 1.2) return 'critical';
  if (value > threshold) return 'warning';
  return 'operational';
};

const getIcon = (type) => {
  switch (type) {
    case 'Énergie': return 'faBolt';
    case 'Transport': return 'faCar';
    case 'Déchets': return 'faTrash';
    case 'Sécurité': return 'faUserShield';
    default: return 'faChartLine';
  }
};

const getIconClass = (type) => {
  switch (type) {
    case 'Énergie': return 'bolt';
    case 'Transport': return 'car';
    case 'Déchets': return 'trash';
    case 'Sécurité': return 'security-staff';
    default: return 'chart';
  }
};

const getNextLabel = (type, labels) => {
  const now = new Date();
  if (type === 'energy') {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[now.getMonth()];
  } else if (type === 'traffic') {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days[now.getDay()];
  } else if (type === 'waste') {
    return `Zone ${labels.length + 1}`;
  }
  return now.toLocaleTimeString();
};

export { startRealTimeUpdates };
