import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Données initiales des capteurs (pour AnalysteDashboard)
export const initialSensorData = [
  {
    date: '18 mars 2025, 08:15',
    id: 'D01',
    type: 'Déchets',
    location: 'Rue Principale',
    data: 'Niveau: 85%',
    status: 'Alerte',
  },
  {
    date: '17 mars 2025, 16:45',
    id: 'D12',
    type: 'Déchets',
    location: 'Parc Central',
    data: 'Niveau: 30%',
    status: 'Normal',
  },
  {
    date: '18 mars 2025, 07:00',
    id: 'E03',
    type: 'Énergie',
    location: 'Mairie',
    data: '120 kWh',
    status: 'Normal',
  },
  {
    date: '17 mars 2025, 14:00',
    id: 'E07',
    type: 'Énergie',
    location: 'Bibliothèque',
    data: '250 kWh',
    status: 'Alerte',
  },
  {
    date: '18 mars 2025, 09:00',
    id: 'T02',
    type: 'Transport',
    location: 'Avenue Centrale',
    data: '450 véhicules/h',
    status: 'Normal',
  },
  {
    date: '17 mars 2025, 17:30',
    id: 'T05',
    type: 'Transport',
    location: 'Boulevard Ouest',
    data: '800 véhicules/h',
    status: 'Alerte',
  },
  {
    date: '18 mars 2025, 03:15',
    id: 'S01',
    type: 'Sécurité',
    location: 'Parking',
    data: 'Mouvement détecté',
    status: 'Alerte',
  },
  {
    date: '16 mars 2025, 23:45',
    id: 'S07',
    type: 'Sécurité',
    location: 'Zone Industrielle',
    data: 'Activité inhabituelle',
    status: 'Alerte critique',
  },
];

// Options de période (pour AnalysteDashboard)
export const periodOptions = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Année' },
];

// Types de capteurs (pour AnalysteDashboard et PerformanceReportsPage)
export const sensorTypeOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'Déchets', label: 'Déchets' },
  { value: 'Énergie', label: 'Énergie' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Sécurité', label: 'Sécurité' },
];

// Générer les labels en fonction de la période (pour DataTrends)
export const generateLabels = (period) => {
  switch (period) {
    case 'day':
      return ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
    case 'week':
      return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    case 'month':
      return Array.from({ length: 31 }, (_, i) => `${i + 1}`);
    case 'year':
      return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    default:
      return ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
  }
};

// Générer des données aléatoires (pour DataTrends)
export const generateRandomData = (min, max, count) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min));
};

// Options de configuration du graphique pour DataTrends
export const getChartOptions = (sensorType, period) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text:
        sensorType === 'all' || sensorType === 'Énergie'
          ? `Tendances de Consommation d'Énergie (${period})`
          : `Flux de Circulation (${period})`,
      font: { size: 16 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          if (sensorType === 'all' || sensorType === 'Énergie') {
            return value + ' kWh';
          } else {
            return value + ' veh/h';
          }
        },
      },
    },
  },
});

// Couleurs pour le graphique Doughnut (pour SensorAnalysis)
export const doughnutChartColors = {
  backgroundColor: [
    'rgba(0, 180, 216, 0.7)',
    'rgba(238, 108, 77, 0.7)',
    'rgba(60, 188, 152, 0.7)',
    'rgba(103, 58, 183, 0.7)',
  ],
  borderColor: [
    'rgba(0, 180, 216, 1)',
    'rgba(238, 108, 77, 1)',
    'rgba(60, 188, 152, 1)',
    'rgba(103, 58, 183, 1)',
  ],
};

// Options de configuration du graphique Doughnut (pour SensorAnalysis)
export const getDoughnutChartOptions = (period) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: `Répartition des capteurs (${period || 'day'})`,
    },
  },
});

// Données statiques pour WasteLevelAnalysis
export const wasteLevelData = {
  zones: [
    'Avenue Habib-Bourguiba',
    'Rue de Marseille',
    'Rue de Rome',
    'Avenue Mohammed-V',
    'Rue Charles-de-Gaulle',
  ],
  wasteLevels: {
    'Avenue Habib-Bourguiba': 85,
    'Rue de Marseille': 45,
    'Rue de Rome': 65,
    'Avenue Mohammed-V': 30,
    'Rue Charles-de-Gaulle': 75,
  },
  thresholds: {
    warning: 65,
    critical: 80,
  },
};

// Couleurs pour le graphique Bar (pour WasteLevelAnalysis)
export const getWasteLevelColors = (level, thresholds) => {
  if (level >= thresholds.critical) {
    return {
      backgroundColor: 'rgba(231, 76, 60, 0.7)', // Red for critical
      borderColor: 'rgba(231, 76, 60, 1)',
    };
  }
  if (level >= thresholds.warning) {
    return {
      backgroundColor: 'rgba(243, 156, 18, 0.7)', // Orange for warning
      borderColor: 'rgba(243, 156, 18, 1)',
    };
  }
  return {
    backgroundColor: 'rgba(46, 204, 113, 0.7)', // Green for normal
    borderColor: 'rgba(46, 204, 113, 1)',
  };
};

// Options de configuration du graphique Bar (pour WasteLevelAnalysis)
export const getWasteLevelChartOptions = (thresholds) => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          let status = 'Normal';
          if (value >= thresholds.critical) status = 'Critique';
          else if (value >= thresholds.warning) status = 'Attention';
          return [`Niveau: ${value}%`, `Statut: ${status}`];
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
});

// Données de collecte (pour WasteLevelAnalysis)
export const COLLECTION_DATA = {
  nextCollection: {
    label: 'Prochaine collecte:',
    value: 'Demain, 08:00',
  },
  lastUpdate: {
    label: 'Dernière mise à jour:',
    value: '19/03/2025, 14:30',
  },
};

// Données statiques pour le dataset du graphique Bar (pour WasteLevelAnalysis)
export const wasteLevelDatasetConfig = {
  label: 'Niveau de remplissage (%)',
  borderWidth: 1,
};

// Données d'exemple pour PerformanceReportsPage
export const sampleReports = [
  {
    id: 1,
    title: 'Transport Efficiency Report',
    description: 'Monthly analysis of transport system efficiency metrics',
    sector: 'Transport',
    createdAt: '2023-10-01',
    lastUpdated: '2023-10-15',
    createdBy: 'John Analyst',
    isScheduled: true,
    scheduleFrequency: 'Monthly',
    data: [
      { metric: 'On-time Performance', value: 87, status: 'normal', trend: '+3%' },
      { metric: 'Passenger Volume', value: 92, status: 'normal', trend: '+5%' },
      { metric: 'Fuel Efficiency', value: 78, status: 'normal', trend: '+2%' },
      { metric: 'Maintenance Costs', value: 65, status: 'alerte', trend: '-2%' },
      { metric: 'Customer Satisfaction', value: 82, status: 'normal', trend: '+1%' },
    ],
  },
  {
    id: 2,
    title: 'Energy Consumption Analysis',
    description: 'Quarterly energy usage across city facilities',
    sector: 'Energy',
    createdAt: '2023-09-15',
    lastUpdated: '2023-10-14',
    createdBy: 'Sarah Analyst',
    isScheduled: false,
    data: [
      { metric: 'Total Consumption', value: 65, status: 'alerte', trend: '-2%' },
      { metric: 'Peak Usage', value: 72, status: 'normal', trend: '-1%' },
      { metric: 'Renewable Percentage', value: 58, status: 'alerte', trend: '+4%' },
      { metric: 'Cost Efficiency', value: 61, status: 'alerte', trend: '-3%' },
      { metric: 'Carbon Footprint', value: 55, status: 'alerte-critique', trend: '-1%' },
    ],
  },
  {
    id: 3,
    title: 'Waste Management Report',
    description: 'Analysis of waste collection and recycling metrics',
    sector: 'Waste',
    createdAt: '2023-09-22',
    lastUpdated: '2023-10-13',
    createdBy: 'John Analyst',
    isScheduled: true,
    scheduleFrequency: 'Weekly',
    data: [
      { metric: 'Recycling Rate', value: 72, status: 'normal', trend: '+5%' },
      { metric: 'Collection Efficiency', value: 85, status: 'normal', trend: '+2%' },
      { metric: 'Processing Time', value: 79, status: 'normal', trend: '+3%' },
      { metric: 'Contamination Rate', value: 68, status: 'alerte', trend: '-4%' },
      { metric: 'Cost per Ton', value: 75, status: 'normal', trend: '+1%' },
    ],
  },
  {
    id: 4,
    title: 'Water Usage Efficiency',
    description: 'Monthly water consumption and conservation metrics',
    sector: 'Water',
    createdAt: '2023-09-30',
    lastUpdated: '2023-10-12',
    createdBy: 'Maria Analyst',
    isScheduled: false,
    data: [
      { metric: 'Usage Efficiency', value: 58, status: 'alerte-critique', trend: '-8%' },
      { metric: 'Leakage Rate', value: 62, status: 'alerte', trend: '-5%' },
      { metric: 'Quality Compliance', value: 95, status: 'normal', trend: '+1%' },
      { metric: 'Treatment Efficiency', value: 88, status: 'normal', trend: '+3%' },
      { metric: 'Distribution Costs', value: 71, status: 'normal', trend: '-2%' },
    ],
  },
  {
    id: 5,
    title: 'Public Safety Metrics',
    description: 'Quarterly public safety and emergency response analysis',
    sector: 'Public Safety',
    createdAt: '2023-09-10',
    lastUpdated: '2023-10-11',
    createdBy: 'Sarah Analyst',
    isScheduled: true,
    scheduleFrequency: 'Monthly',
    data: [
      { metric: 'Response Time', value: 92, status: 'normal', trend: '+1%' },
      { metric: 'Incident Resolution', value: 88, status: 'normal', trend: '+2%' },
      { metric: 'Public Satisfaction', value: 85, status: 'normal', trend: '+3%' },
      { metric: 'Officer Efficiency', value: 90, status: 'normal', trend: '+1%' },
      { metric: 'Cost per Incident', value: 78, status: 'normal', trend: '-2%' },
    ],
  },
];

// Couleurs pour le graphique (pour PerformanceReportsPage)
export const performanceChartColors = {
  backgroundColor: [
    'rgba(26, 42, 68, 0.7)',
    'rgba(0, 180, 216, 0.7)',
    'rgba(144, 224, 239, 0.7)',
    'rgba(72, 202, 228, 0.7)',
    'rgba(0, 119, 182, 0.7)',
  ],
  borderColor: [
    'rgba(26, 42, 68, 1)',
    'rgba(0, 180, 216, 1)',
    'rgba(144, 224, 239, 1)',
    'rgba(72, 202, 228, 1)',
    'rgba(0, 119, 182, 1)',
  ],
};

// Options de configuration du graphique (pour PerformanceReportsPage)
export const getPerformanceChartOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: title || 'Performance Metrics',
    },
  },
});

// Types de capteurs (pour PerformanceReportsPage)
export const SENSOR_TYPES = ['Transport', 'Sécurité', 'Énergie', 'Déchets'];

// Métriques par type de capteur (pour PerformanceReportsPage)
export const METRICS_BY_TYPE = {
  Transport: ['Flux de véhicules', "Temps d'attente", 'Vitesse moyenne'],
  Sécurité: ['Détections de mouvement', 'Incidents', "Niveau d'alerte"],
  Énergie: ['Consommation', 'Efficacité', 'Pic de charge'],
  Déchets: ['Niveau de remplissage', 'Taux de collecte', 'Taux de tri'],
};

// Options de période pour les rapports (pour PerformanceReportsPage)
export const reportPeriodOptions = [
  { value: 'day', label: 'Quotidien' },
  { value: 'week', label: 'Hebdomadaire' },
  { value: 'month', label: 'Mensuel' },
  { value: 'quarter', label: 'Trimestriel' },
  { value: 'year', label: 'Annuel' },
];

// Options de fréquence pour la planification (pour PerformanceReportsPage)
export const scheduleFrequencyOptions = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
];

// Options de jours pour la planification hebdomadaire (pour PerformanceReportsPage)
export const scheduleDayOptions = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
];

// Options de format pour l'exportation (pour PerformanceReportsPage)
export const exportFormatOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
];