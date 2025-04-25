// src/utils/initData.js
import Sensor from '../models/Sensor.js';
import Metrics from '../models/Metrics.js';
import ChartData from '../models/ChartData.js';
import Config from '../models/Config.js';
import User from '../models/userModel.js';
import Location from '../models/Location.js';
import Alert from '../models/Alert.js';
import MaintenanceTask from '../models/MaintenanceTask.js';
import Rapport from "../models/Report";
import { hash } from 'bcrypt';

const initData = async () => {
  // Initialiser les capteurs
  const sensors = [
    {
      id: 'E01',
      type: 'Énergie',
      location: 'Centre-ville',
      status: 'operational',
      lastUpdate: new Date(),
      value: 1200,
      unit: 'kWh',
      threshold: 150
    },
    {
      id: 'T01',
      type: 'Transport',
      location: 'Avenue principale',
      status: 'warning',
      lastUpdate: new Date(),
      value: 450,
      unit: 'véhicules/h',
      threshold: 400
    },
    {
      id: 'D01',
      type: 'Déchets',
      location: 'Zone commerciale',
      status: 'critical',
      lastUpdate: new Date(),
      value: 85,
      unit: '%',
      threshold: 80
    },
    {
      id: 'S01',
      type: 'Sécurité',
      location: 'Parc public',
      status: 'operational',
      lastUpdate: new Date(),
      value: 0,
      unit: 'incidents',
      threshold: 1
    }
  ];
  for (const sensor of sensors) {
    if (!await Sensor.findOne({ id: sensor.id })) {
      await new Sensor(sensor).save();
    }
  }

  // Initialiser les métriques
  const metrics = [
    {
      type: 'Énergie',
      primaryMetric: {
        title: "Consommation d'Énergie",
        value: '425 kWh',
        icon: 'faBolt',
        iconClass: 'bolt',
        percentage: 2.4,
        comparison: '(hier)',
        label: 'Moyenne journalière'
      },
      lastUpdated: new Date()
    },
    {
      type: 'Transport',
      primaryMetric: {
        title: 'Flux de Circulation',
        value: '3190 véh/h',
        icon: 'faCar',
        iconClass: 'car',
        percentage: 1.2,
        comparison: '(hier)',
        label: 'Capacité routière utilisée'
      },
      lastUpdated: new Date()
    },
    {
      type: 'Déchets',
      primaryMetric: {
        title: 'Niveau de Déchets',
        value: '75%',
        icon: 'faTrash',
        iconClass: 'trash',
        percentage: 4.8,
        comparison: '(hier)',
        label: 'Cette semaine'
      },
      lastUpdated: new Date()
    },
    {
      type: 'Sécurité',
      primaryMetric: {
        title: 'Personnel de Sécurité',
        value: '12/15',
        icon: 'faUserShield',
        iconClass: 'security-staff',
        percentage: 0.8,
        comparison: '(hier)',
        label: 'Toutes zones confondues'
      },
      lastUpdated: new Date()
    }
  ];
  for (const metric of metrics) {
    if (!await Metrics.findOne({ type: metric.type })) {
      await new Metrics(metric).save();
    }
  }

  // Initialiser les données de graphiques
  const charts = [
    {
      type: 'energy',
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [{
        label: 'Consommation (kWh)',
        data: [4500, 4200, 4800, 4300, 4600, 4400],
        backgroundColor: 'rgba(224, 224, 224, 0.7)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }],
      lastUpdated: new Date()
    },
    {
      type: 'traffic',
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [
        {
          label: 'Voitures',
          data: [350, 420, 380, 450, 400, 280, 220],
          backgroundColor: 'rgba(0, 123, 255, 0.7)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        },
        {
          label: 'Bus',
          data: [120, 150, 130, 160, 140, 90, 70],
          backgroundColor: 'rgba(255, 152, 0, 0.7)',
          borderColor: 'rgba(255, 152, 0, 1)',
          borderWidth: 1
        },
        {
          label: 'Vélos',
          data: [80, 100, 90, 110, 95, 60, 50],
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1
        }
      ],
      lastUpdated: new Date()
    },
    {
      type: 'waste',
      labels: ['< 30%', '30-50%', '50-70%', '70-90%', '> 90%'],
      datasets: [{
        label: 'Distribution',
        data: [15, 25, 30, 20, 10],
        backgroundColor: ['#4caf50', '#8bc34a', '#ffc107', '#ff9800', '#f44336'],
        borderColor: ['#4caf50', '#8bc34a', '#ffc107', '#ff9800', '#f44336'],
        borderWidth: 1
      }],
      lastUpdated: new Date()
    }
  ];
  for (const chart of charts) {
    if (!await ChartData.findOne({ type: chart.type })) {
      await new ChartData(chart).save();
    }
  }

  // Initialiser la configuration
  const config = {
    energy: { threshold: 5000, checkFrequency: 300 },
    waste: { threshold: 80, checkFrequency: 3600 },
    transport: { threshold: 400, checkFrequency: 300 },
    security: { checkFrequency: 60 }
  };
  if (!await Config.findOne()) {  // Changed from findOne() to Config.findOne()
    await new Config(config).save();
  }

  // Initialiser un utilisateur admin
  const admin = {
    id: 'u001',
    name: 'Admin Principal',
    email: 'admin@example.com',
    password: await hash('admin123', 10),
    role: 'administrator',
    status: 'active',
    lastLogin: new Date()
  };
  if (!await User.findOne({ email: admin.email })) {
    await new User(admin).save();
  }

  // Initialiser les locations
  const locations = [
    {
      id: 'loc-001',
      name: 'Centre-ville',
      type: 'urban',
      coordinates: {
        latitude: 36.8065,
        longitude: 10.1815
      },
      address: 'Avenue Habib Bourguiba, Tunis',
      description: 'Centre-ville principal avec forte densité de population',
      status: 'active'
    },
    {
      id: 'loc-002',
      name: 'Zone commerciale',
      type: 'commercial',
      coordinates: {
        latitude: 36.8489,
        longitude: 10.2648
      },
      address: 'Rue de Marseille, Tunis',
      description: 'Zone commerciale avec nombreux magasins et restaurants',
      status: 'active'
    },
    {
      id: 'loc-003',
      name: 'Parc public',
      type: 'residential',
      coordinates: {
        latitude: 36.8195,
        longitude: 10.1657
      },
      address: 'Avenue Mohammed V, Tunis',
      description: 'Parc public avec espaces verts et aires de loisirs',
      status: 'active'
    },
    {
      id: 'loc-004',
      name: 'Zone industrielle',
      type: 'industrial',
      coordinates: {
        latitude: 36.7325,
        longitude: 10.2301
      },
      address: 'Rue de Rome, Tunis',
      description: 'Zone industrielle avec usines et entrepôts',
      status: 'active'
    }
  ];

  for (const location of locations) {
    if (!await Location.findOne({ id: location.id })) {
      await new Location(location).save();
    }
  }

  // Initialiser les alertes
  const alerts = [
    {
      id: 'A001',
      type: 'critical',
      message: 'Niveau de déchets critique détecté',
      location: 'Zone commerciale',
      timestamp: new Date('2024-03-18T07:30:00'),
      sensorId: 'D01',
      resolved: false
    },
    {
      id: 'A002',
      type: 'warning',
      message: 'Trafic dense détecté',
      location: 'Avenue principale',
      timestamp: new Date('2024-03-18T09:00:00'),
      sensorId: 'T01',
      resolved: false
    },
    {
      id: 'A003',
      type: 'info',
      message: 'Maintenance préventive programmée',
      location: 'Centre-ville',
      timestamp: new Date('2024-03-18T08:00:00'),
      sensorId: 'E01',
      resolved: true
    },
    {
      id: 'A004',
      type: 'warning',
      message: 'Consommation d\'énergie élevée',
      location: 'Bibliothèque',
      timestamp: new Date('2024-03-17T14:00:00'),
      sensorId: 'E07',
      resolved: false
    },
    {
      id: 'A005',
      type: 'critical',
      message: 'Activité inhabituelle détectée',
      location: 'Zone Industrielle',
      timestamp: new Date('2024-03-16T23:45:00'),
      sensorId: 'S07',
      resolved: false
    }
  ];

  for (const alert of alerts) {
    if (!await Alert.findOne({ id: alert.id })) {
      await new Alert(alert).save();
    }
  }

  // Initialiser les tâches de maintenance
  const maintenanceTasks = [
    {
      id: 'm001',
      sensorId: 'T01',
      sensorName: 'Capteur de flux de transport',
      taskType: 'replacement',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 jours à partir de maintenant
      priority: 'high',
      status: 'pending',
      notes: 'Remplacement préventif du capteur de trafic'
    },
    {
      id: 'm002',
      sensorId: 'E01',
      sensorName: 'Capteur de consommation d\'énergie',
      taskType: 'repair',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 heures à partir de maintenant
      priority: 'critical',
      status: 'in_progress',
      assignedTo: 'Technicien 1',
      notes: 'Défaillance détectée, l\'unité ne transmet pas de données'
    },
    {
      id: 'm003',
      sensorId: 'D01',
      sensorName: 'Capteur de niveau de déchets',
      taskType: 'calibration',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 jours à partir de maintenant
      priority: 'medium',
      status: 'pending',
      notes: 'Calibration régulière requise'
    },
    {
      id: 'm004',
      sensorId: 'S01',
      sensorName: 'Capteur de sécurité',
      taskType: 'inspection',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 jour à partir de maintenant
      priority: 'low',
      status: 'pending',
      notes: 'Inspection de routine'
    }
  ];

  for (const task of maintenanceTasks) {
    if (!await MaintenanceTask.findOne({ id: task.id })) {
      await new MaintenanceTask(task).save();
    }
  }
};

export default initData ;
