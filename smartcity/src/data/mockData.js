export const AlertType = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info'
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

export const Sensor = {
  id: '',
  name: '',
  type: '',
  location: '',
  status: '',
  lastReading: null,
  batteryLevel: 100,
  lastMaintenance: null,
  nextMaintenance: null
};

export const MaintenanceTask = {
  id: '',
  title: '',
  description: '',
  type: '',
  priority: '',
  status: '',
  dueDate: new Date(),
  assignedTo: '',
  completedAt: null
}; 

// Alerts mock data
export const alerts = [
  {
    id: "a1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    type: "critical",
    message: "Capteur en panne détecté dans le système de surveillance de l'énergie",
    location: "Station du centre-ville",
    sensorId: "s2",
    resolved: false,
  },
  {
    id: "a2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: "warning",
    message: "Niveau de batterie faible dans le capteur de transport",
    location: "Intersection principale",
    sensorId: "s1",
    resolved: false,
  },
  {
    id: "a3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    type: "info",
    message: "Maintenance régulière recommandée pour le capteur de déchets",
    location: "Parc Riverside",
    sensorId: "s3",
    resolved: false,
  },
  {
    id: "a4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    type: "warning",
    message: "Lectures inhabituelles du capteur de sécurité",
    location: "Hôtel de ville",
    sensorId: "s4",
    resolved: true,
  },
  {
    id: "a5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    type: "critical",
    message: "Connexion perdue avec le contrôleur d'énergie",
    location: "Parc Central",
    sensorId: "s5",
    resolved: true,
  },
];

// Sensors mock data
export const sensors = [
  {
    id: "s1",
    name: "Capteur de flux de transport",
    type: "transport",
    location: "Intersection principale",
    status: "warning",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    installationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // 1 year ago
    batteryLevel: 25,
    readings: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 60), value: 245, unit: "véhicules/heure" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 120), value: 300, unit: "véhicules/heure" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 180), value: 275, unit: "véhicules/heure" },
    ],
  },
  {
    id: "s2",
    name: "Moniteur de consommation d'énergie",
    type: "energie",
    location: "Station du centre-ville",
    status: "failed",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    installationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180), // 6 months ago
    batteryLevel: 0,
    readings: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 60), value: 0, unit: "kWh" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 120), value: 35, unit: "kWh" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 180), value: 42, unit: "kWh" },
    ],
  },
  {
    id: "s3",
    name: "Capteur de niveau de déchets",
    type: "dechet",
    location: "Parc Riverside",
    status: "operational",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    installationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150), // 150 days ago
    batteryLevel: 80,
    readings: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 60), value: 65, unit: "%" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 120), value: 58, unit: "%" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 180), value: 42, unit: "%" },
    ],
  },
  {
    id: "s4",
    name: "Capteur de sécurité",
    type: "securite",
    location: "Hôtel de ville",
    status: "operational",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    installationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200), // 200 days ago
    batteryLevel: 65,
    readings: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 60), value: 0, unit: "alertes" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 120), value: 2, unit: "alertes" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 180), value: 0, unit: "alertes" },
    ],
  },
  {
    id: "s5",
    name: "Contrôleur d'énergie intelligent",
    type: "energie",
    location: "Parc Central",
    status: "maintenance",
    lastMaintenance: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    installationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
    batteryLevel: 100,
    readings: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 60), value: 100, unit: "%" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 120), value: 0, unit: "%" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 180), value: 0, unit: "%" },
    ],
  },
];

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
    assignedTo: "Technicien 1",
    notes: "Battery needs to be replaced due to low power levels",
  },
  {
    id: "m2",
    sensorId: "s2",
    sensorName: "Moniteur de consommation d'énergie",
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
    assignedTo: "Technicien 1",
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
  {
    id: "m5",
    sensorId: "s5",
    sensorName: "Contrôleur d'énergie intelligent",
    taskType: "repair",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    priority: "high",
    status: "completed",
    assignedTo: "Technicien 2",
    notes: "Connection issue resolved, module replaced",
  },
];

// Helper functions
export const getAlertIcon = (type) => {
  switch (type) {
    case "critical":
      return "bell-ring";
    case "warning":
      return "bell-alert";
    case "info":
      return "bell";
    default:
      return "bell";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "operational":
      return "tech-green";
    case "warning":
      return "tech-yellow";
    case "failed":
      return "tech-red";
    case "maintenance":
      return "tech-blue";
    default:
      return "gray";
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

export const getSensorTypeIcon = (type) => {
  switch (type) {
    case "energie":
      return "battery";
    case "dechet":
      return "trash";
    case "transport":
      return "car";
    case "securite":
      return "shield";
    default:
      return "cpu";
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

export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " ans";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " mois";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " jours";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " heures";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  
  return Math.floor(seconds) + " secondes";
}; 