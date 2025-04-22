import {
  SensorType,
  SensorStatus,
  AlertType,
  sharedSensors,
  sharedAlerts,
  getStatusColor,
  getSensorTypeIcon,
  getTimeAgo
} from './sharedData';

// Réexporter getSensorTypeIcon
export { getSensorTypeIcon };

// Capteur de sécurité
export const CapteurSecurite = {
  id: '',
  status: SensorStatus.OPERATIONAL,
  dernier_mise_a_jour: null,
  pourcentage: 0,
  type: SensorType.SECURITE,
  anomalieDetection: 0
};

// Capteur de transport
export const CapteurTransport = {
  id: '',
  status: SensorStatus.OPERATIONAL,
  dernier_mise_a_jour: null,
  pourcentage: 0,
  type: SensorType.TRANSPORT,
  fluxActuelle: 0
};

// Capteur de déchet
export const CapteurDechet = {
  id: '',
  status: SensorStatus.OPERATIONAL,
  dernier_mise_a_jour: null,
  pourcentage: 0,
  type: SensorType.DECHET,
  niveaux_remplissage: 0
};

// Capteur d'énergie
export const CapteurEnergie = {
  id: '',
  status: SensorStatus.OPERATIONAL,
  dernier_mise_a_jour: null,
  pourcentage: 0,
  type: SensorType.ENERGIE,
  seuilConsomation: 0
};

// Factory function pour créer le bon type de capteur selon le type spécifié
export const createSensor = (type) => {
  switch (type) {
    case SensorType.SECURITE:
      return { ...CapteurSecurite };
    case SensorType.TRANSPORT:
      return { ...CapteurTransport };
    case SensorType.DECHET:
      return { ...CapteurDechet };
    case SensorType.ENERGIE:
      return { ...CapteurEnergie };
    default:
      return { 
        id: '',
        status: SensorStatus.OPERATIONAL,
        dernier_mise_a_jour: null,
        pourcentage: 0,
        type 
      };
  }
};

export const Alert = {
  id: '',
  timestamp: new Date(),
  type: AlertType.INFO,
  message: '',
  location: '',
  sensorId: '',
  resolved: false
};

export const MaintenanceTask = {
  id: '',
  sensorId: '',
  sensorName: '',
  taskType: '',
  dueDate: new Date(),
  priority: '',
  status: '',
  notes: ''
};

// Alerts mock data
export const alerts = sharedAlerts;

// Sensors mock data with new structure
export const sensors = sharedSensors;

// Maintenance tasks mock data
export const maintenanceTasks = [
  {
    id: "m1",
    sensorId: "s1",
    sensorName: "Capteur de flux de transport",
    taskType: "replacement",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    priority: "high",
    status: "pending",
    notes: "il y'a une flux",
  },
  {
    id: "m2",
    sensorId: "s2",
    sensorName: "Consommation d'énergie",
    taskType: "repair",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
    priority: "critical",
    status: "in_progress",
    assignedTo: "Technicien 2",
    notes: "Complete failure detected, unit not transmitting data",
  },
  {
    id: "m3",
    sensorId: "s3",
    sensorName: "Capteur de niveau de déchets",
    taskType: "calibration",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    priority: "medium",
    status: "pending",
    notes: "Routine calibration as per maintenance schedule",
  },
  {
    id: "m4",
    sensorId: "s4",
    sensorName: "Capteur de sécurité",
    taskType: "inspection",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    priority: "low",
    status: "pending",
    assignedTo: "Technicien 3",
    notes: "Regular inspection to verify sensor accuracy",
  },
];

// Helper functions
export const getAlertIcon = (type) => {
  switch (type) {
    case AlertType.CRITICAL:
      return "bell-ring";
    case AlertType.WARNING:
      return "bell-alert";
    case AlertType.INFO:
      return "bell";
    default:
      return "bell";
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "critical":
      return "tech-red";
    case "high":
      return "tech-yellow";
    case "medium":
      return "tech-blue";
    case "low":
      return "tech-green";
    default:
      return "gray";
  }
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};