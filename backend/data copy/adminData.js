import {
  SensorType,
  SensorStatus,
  AlertType,
  sharedSensors,
  sharedAlerts,
  getStatusColor,
  getSensorTypeIcon
} from './sharedData';

// Réexporter les types et fonctions importés
export { 
  SensorType,
  SensorStatus,
  AlertType,
  getStatusColor,
  getSensorTypeIcon
};

// Alertes actives (filtrées à partir des alertes partagées)
export const initialActiveAlerts = sharedAlerts.filter(alert => !alert.resolved);
export const activeAlerts = initialActiveAlerts;
export const resolvedAlerts = sharedAlerts.filter(alert => alert.resolved);

// Données d'énergie
export const energyData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Consommation (kWh)',
      data: [4500, 4200, 4800, 4300, 4600, 4400],
      backgroundColor: 'rgba(224, 224, 224, 0.7)',
      borderColor: 'rgba(0, 123, 255, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }
  ]
};

export const energyOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { 
      display: true, 
      text: 'Consommation Énergétique', 
      font: { size: 16 } 
    }
  },
  scales: {
    y: { 
      beginAtZero: true, 
      title: { 
        display: true, 
        text: 'Consommation (kWh)' 
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: { 
      title: { 
        display: true, 
        text: 'Mois' 
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

// Données de trafic
export const trafficData = {
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
  ]
};

export const trafficOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { 
      display: true, 
      text: 'Flux de Circulation (Semaine)', 
      font: { size: 16 } 
    }
  },
  scales: {
    y: { 
      beginAtZero: true, 
      title: { 
        display: true, 
        text: 'Véhicules par jour' 
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: { 
      title: { 
        display: true, 
        text: 'Jour' 
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

// Zones de la ville
export const zones = [
  { id: 1, name: 'Avenue Habib-Bourguiba', status: 'normal' },
  { id: 2, name: 'Rue de Marseille', status: 'warning' },
  { id: 3, name: 'Rue de Rome', status: 'normal' },
  { id: 4, name: 'Avenue Mohammed-V', status: 'alert' }
];

// Niveaux de déchets
export const wasteLevels = [
  { id: 1, location: 'Avenue Habib-Bourguiba', level: 75 },
  { id: 2, location: 'Rue de Marseille', level: 90 },
  { id: 3, location: 'Rue de Rome', level: 45 },
  { id: 4, location: 'Avenue Mohammed-V', level: 80 }
];

// Métriques principales
export const metricsData = [
  {
    type: 'Énergie',
    primaryMetric: {
      title: "Consommation d'Énergie",
      value: '425 kWh',
      icon: 'faBolt',
      iconClass: 'bolt',
      percentage: 2.4,
      comparison: '(hier)',
      label: 'Moyenne journalière',
    },
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
      label: 'Capacité routière utilisée',
    },
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
      label: 'Cette semaine',
    },
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
      label: 'Toutes zones confondues',
    },
  },
];

// Configuration initiale
export const initialConfigSettings = {
  energy: {
    threshold: 5000,
    checkFrequency: 300
  },
  waste: {
    threshold: 80,
    checkFrequency: 3600
  },
  security: {
    checkFrequency: 60
  }
};

// Historique des capteurs
export const initialSensorHistory = [
  {
    id: 1,
    timestamp: new Date('2024-03-10T08:00:00'),
    type: SensorType.ENERGIE,
    location: 'Avenue Habib-Bourguiba',
    status: SensorStatus.OPERATIONAL,
    value: 425,
    unit: 'kWh'
  },
  {
    id: 2,
    timestamp: new Date('2024-03-10T08:30:00'),
    type: SensorType.DECHET,
    location: 'Rue de Marseille',
    status: SensorStatus.WARNING,
    value: 90,
    unit: '%'
  },
  {
    id: 3,
    timestamp: new Date('2024-03-10T09:00:00'),
    type: SensorType.SECURITY,
    location: 'Rue de Rome',
    status: SensorStatus.OPERATIONAL,
    value: 0,
    unit: 'incidents'
  },
  {
    id: 4,
    timestamp: new Date('2024-03-10T09:30:00'),
    type: SensorType.TRANSPORT,
    location: 'Avenue Mohammed-V',
    status: SensorStatus.WARNING,
    value: 3190,
    unit: 'véh/h'
  },
  
];

// Utilisateurs
export const initialUsers = [
  {
    id: 1,
    name: 'Admin Principal',
    role: 'administrator',
    status: 'active',
    lastLogin: new Date('2024-03-10T08:00:00')
  },
  {
    id: 2,
    name: 'Analyste Data 1',
    role: 'analyst',
    status: 'active',
    lastLogin: new Date('2024-03-10T07:30:00')
  },
  {
    id: 3,
    name: 'Analyste Data 2',
    role: 'analyst',
    status: 'inactive',
    lastLogin: new Date('2024-03-09T16:45:00')
  }
];