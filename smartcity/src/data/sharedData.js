// Types et constantes partagées
export const SensorType = {
  ENERGIE: 'Énergie',
  TRANSPORT: 'Transport',
  DECHET: 'Déchets',
  SECURITE: 'Sécurité',
  // Alias pour compatibilité
  ENERGY: 'Énergie',
  WASTE: 'Déchets',
  SECURITY: 'Sécurité'
};

export const SensorStatus = {
  OPERATIONAL: 'operational',
  WARNING: 'warning',
  CRITICAL: 'critical',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline'
};

export const AlertType = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
  SUCCESS: 'success'
};

// Données partagées des capteurs
export const sharedSensors = [
  {
    id: 'E01',
    type: SensorType.ENERGIE,
    location: 'Centre-ville',
    status: SensorStatus.OPERATIONAL,
    lastUpdate: new Date('2024-03-18T08:15:00'),
    value: 120,
    unit: 'kWh',
    threshold: 150
  },
  {
    id: 'T01',
    type: SensorType.TRANSPORT,
    location: 'Avenue principale',
    status: SensorStatus.WARNING,
    lastUpdate: new Date('2024-03-18T09:00:00'),
    value: 450,
    unit: 'véhicules/h',
    threshold: 400
  },
  {
    id: 'D01',
    type: SensorType.DECHET,
    location: 'Zone commerciale',
    status: SensorStatus.CRITICAL,
    lastUpdate: new Date('2024-03-18T07:30:00'),
    value: 85,
    unit: '%',
    threshold: 80
  },
  {
    id: 'S01',
    type: SensorType.SECURITE,
    location: 'Parc public',
    status: SensorStatus.OPERATIONAL,
    lastUpdate: new Date('2024-03-18T10:00:00'),
    value: 0,
    unit: 'incidents',
    threshold: 1
  }
];

// Données partagées des alertes
export const sharedAlerts = [
  {
    id: 'A001',
    type: AlertType.CRITICAL,
    message: 'Niveau de déchets critique détecté',
    location: 'Zone commerciale',
    timestamp: new Date('2024-03-18T07:30:00'),
    sensorId: 'D01',
    resolved: false
  },
  {
    id: 'A002',
    type: AlertType.WARNING,
    message: 'Trafic dense détecté',
    location: 'Avenue principale',
    timestamp: new Date('2024-03-18T09:00:00'),
    sensorId: 'T01',
    resolved: false
  },
  {
    id: 'A003',
    type: AlertType.INFO,
    message: 'Maintenance préventive programmée',
    location: 'Centre-ville',
    timestamp: new Date('2024-03-18T08:00:00'),
    sensorId: 'E01',
    resolved: true
  }
];

// Données partagées des rapports
export const sharedReports = [
  {
    id: 'R001',
    title: 'Analyse de la consommation énergétique',
    type: 'Énergie',
    date: new Date('2024-03-17'),
    summary: 'Tendance à la hausse de la consommation',
    metrics: {
      current: 120,
      previous: 110,
      unit: 'kWh'
    }
  },
  {
    id: 'R002',
    title: 'Rapport de trafic',
    type: 'Transport',
    date: new Date('2024-03-17'),
    summary: 'Augmentation du trafic aux heures de pointe',
    metrics: {
      current: 450,
      previous: 400,
      unit: 'véhicules/h'
    }
  }
];

// Fonctions utilitaires partagées
export const getStatusColor = (status) => {
  switch (status) {
    case SensorStatus.OPERATIONAL:
      return '#4CAF50';
    case SensorStatus.WARNING:
      return '#FFC107';
    case SensorStatus.CRITICAL:
      return '#F44336';
    case SensorStatus.MAINTENANCE:
      return '#2196F3';
    case SensorStatus.OFFLINE:
      return '#9E9E9E';
    default:
      return '#9E9E9E';
  }
};

export const getSensorTypeIcon = (type) => {
  switch (type) {
    case SensorType.ENERGIE:
      return 'bolt';
    case SensorType.TRANSPORT:
      return 'car';
    case SensorType.DECHET:
      return 'trash';
    case SensorType.SECURITE:
      return 'shield';
    default:
      return 'sensor';
  }
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