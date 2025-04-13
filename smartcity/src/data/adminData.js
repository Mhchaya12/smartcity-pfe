export const AlertType = {
    INFO: "INFO",
    WARNING: "WARNING",
    CRITICAL: "CRITICAL",
    NOTICE: "NOTICE",
  };
  
  export const initialActiveAlerts = [
    {
      id: 1,
      timestamp: new Date("2025-03-14T23:23:00"),
      type: AlertType.WARNING,
      message: "Consommation d'énergie dépassée",
      location: "Rue de Marseille",
      sensorId: "",
      resolved: false,
    },
    {
      id: 2,
      timestamp: new Date("2025-03-14T22:53:00"),
      type: AlertType.CRITICAL,
      message: "Niveau de déchets critique",
      location: "Avenue Mohammed-V",
      sensorId: "",
      resolved: false,
    },
    {
      id: 3,
      timestamp: new Date("2025-03-14T21:38:00"),
      type: AlertType.INFO,
      message: "Flux de circulation élevé",
      location: "Avenue Centrale",
      sensorId: "",
      resolved: false,
    },
    {
      id: 4,
      timestamp: new Date("2025-03-14T20:38:00"),
      type: AlertType.NOTICE,
      message: "Sécurité en dessous des normes",
      location: "Avenue Habib-Bourguiba",
      sensorId: "",
      resolved: false,
    },
  ];

  export const energyData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Consommation',
        data: [300, 350, 300, 400, 500, 450, 400],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  export const energyOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Consommation d'Énergie (24H)", font: { size: 16 } },
    },
    scales: {
      y: { beginAtZero: true, max: 600, title: { display: true, text: 'kWh' } },
      x: { title: { display: true, text: 'Heure' } },
    },
  };
  
  export const trafficData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Cars',
        data: [4500, 5000, 4000, 4800, 5500, 3000, 3500],
        backgroundColor: '#007bff',
      },
      {
        label: 'Buses',
        data: [1000, 1200, 800, 1100, 1300, 600, 700],
        backgroundColor: '#ff9800',
      },
      {
        label: 'Bikes',
        data: [500, 600, 400, 700, 800, 300, 400],
        backgroundColor: '#4caf50',
      },
    ],
  };
  
  export const trafficOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Flux de Circulation (Semaine)', font: { size: 16 } },
    },
    scales: {
      y: { beginAtZero: true, max: 6000, title: { display: true, text: 'Véhicules par jour' } },
      x: { title: { display: true, text: 'Jour' } },
    },
  };

  export const zones = [
    'Avenue Habib-Bourguiba',
    'Rue de Marseille',
    'Rue de Rome',
    'Avenue Mohammed-V',
  ];
  
  export const wasteLevels = {
    'Avenue Habib-Bourguiba': 75,
    'Rue de Marseille': 90,
    'Rue de Rome': 45,
    'Avenue Mohammed-V': 80,
  };

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


  export const activeAlerts = [
    {
      id: 1,
      timestamp: new Date("2025-03-14T23:23:00"),
      type: AlertType.WARNING,
      message: "Consommation d'énergie dépassée",
      location: "Rue de Marseille",
      sensorId: "",
      resolved: false,
    },
    {
      id: 2,
      timestamp: new Date("2025-03-14T22:53:00"),
      type: AlertType.CRITICAL,
      message: "Niveau de déchets critique",
      location: "Avenue Mohammed-V",
      sensorId: "",
      resolved: false,
    },
    {
      id: 3,
      timestamp: new Date("2025-03-14T21:38:00"),
      type: AlertType.INFO,
      message: "Flux de circulation élevé",
      location: "Avenue Centrale",
      sensorId: "",
      resolved: false,
    },
    {
      id: 4,
      timestamp: new Date("2025-03-14T20:38:00"),
      type: AlertType.NOTICE,
      message: "Sécurité en семьи des normes",
      location: "Avenue Habib-Bourguiba",
      sensorId: "",
      resolved: false,
    },
    {
      id: 5,
      timestamp: new Date("2025-03-14T20:08:00"),
      type: AlertType.WARNING,
      message: "Fuite d'eau détectée",
      location: "Réseau principal",
      sensorId: "",
      resolved: false,
    },
  ];
  
  export const resolvedAlerts = [
    {
      id: 6,
      timestamp: new Date("2025-03-14T19:45:00"),
      type: AlertType.SUCCESS,
      message: "Panne résolue",
      location: "Zone 1",
      sensorId: "",
      resolved: true,
    },
  ];

  export const initialConfigSettings = {
    energyThreshold: 300,
    peakStart: '07:00',
    peakEnd: '14:00',
    peakMorning: '09:00',
    peakEvening: '17:30',
    trafficInterval: 30,
    wasteThreshold: 85,
    wasteFrequency: 'QUOTIDIENNE',
    wasteTime: '08:15',
    securityIncidentThreshold: 1,
    securityCheckFrequency: '15 minutes',
    securityCriticalLevel: 2,
  };

  export const initialSensorHistory = [
    { date: '18 mars 2025, 08:15', id: 'D01', type: 'Déchets', location: 'Avenue Habib-Bourguiba', data: 'Niveau: 85%', status: 'Alerte' },
    { date: '17 mars 2025, 16:45', id: 'D12', type: 'Déchets', location: 'Rue de Marseille', data: 'Niveau: 30%', status: 'Normal' },
    { date: '18 mars 2025, 07:00', id: 'E03', type: 'Énergie', location: 'Mairie', data: '120 kWh', status: 'Normal' },
    { date: '17 mars 2025, 14:00', id: 'E07', type: 'Énergie', location: 'Bibliothèque', data: '250 kWh', status: 'Alerte' },
    { date: '18 mars 2025, 09:00', id: 'T02', type: 'Transport', location: 'Avenue Centrale', data: '450 véhicules/h', status: 'Normal' },
    { date: '17 mars 2025, 17:30', id: 'T05', type: 'Transport', location: 'Boulevard Ouest', data: '800 véhicules/h', status: 'Alerte' },
    { date: '18 mars 2025, 03:15', id: 'S01', type: 'Sécurité', location: 'Parking', data: 'Mouvement détecté', status: 'Alerte' },
    { date: '16 mars 2025, 23:45', id: 'S07', type: 'Sécurité', location: 'Rue de Rome', data: 'Activité inhabituelle', status: 'Alerte critique' },
  ];

  export const initialUsers = [
    { id: 1, username: 'admin', email: 'admin@smartcity.com', role: 'Administrator', status: 'Active' },
    { id: 2, username: 'analyst1', email: 'analyst1@smartcity.com', role: 'Analyste des données', status: 'Active' },
    { id: 3, username: 'tech1', email: 'tech1@smartcity.com', role: 'Technicien', status: 'Active' },
  ];