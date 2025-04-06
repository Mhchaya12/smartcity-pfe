const energyData = {
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

const energyOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Consommation d\'Énergie (24H)', font: { size: 16 } },
  },
  scales: {
    y: { beginAtZero: true, max: 600, title: { display: true, text: 'kWh' } },
    x: { title: { display: true, text: 'Heure' } },
  },
};

const trafficData = {
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

const trafficOptions = {
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

const metricsData = [
  {
    title: 'Consommation d\'Énergie',
    value: '425 kWh',
    icon: <FontAwesomeIcon icon={faBolt} />,
    iconClass: 'bolt',
    percentage: 2.4,
    comparison: '(hier)',
    label: 'Moyenne journalière',
  },
  {
    title: 'Flux de Circulation',
    value: '3190 véh/h',
    icon: <FontAwesomeIcon icon={faCar} />, 
    iconClass: 'car',
    percentage: 1.2,
    comparison: '(hier)',
    label: 'Capacité routière utilisée',
  },
  {
    title: 'Niveau de Déchets',
    value: '75%',
    icon: <FontAwesomeIcon icon={faTrash} />,
    iconClass: 'trash',
    percentage: 4.8,
    comparison: '(hier)',
    label: 'Cette semaine',
  },
  {
    title: 'Personnel de Sécurité',
    value: '12/15', 
    icon: <FontAwesomeIcon icon={faUserShield} />, 
    iconClass: 'security-staff',
    percentage: 0.8, 
    comparison: '(hier)',
    label: 'Toutes zones confondues',
  },
];

const wasteLevels = [
  { zone: 'Zone 1', organic: 60, recyclable: 75, nonRecyclable: 50 },
  { zone: 'Zone 3', organic: 80, recyclable: 90, nonRecyclable: 70 },
  { zone: 'Zone 4', organic: 40, recyclable: 45, nonRecyclable: 30 },
  { zone: 'Zone 5', organic: 70, recyclable: 80, nonRecyclable: 60 },
];

const initialActiveAlerts = [
  { id: 1, title: "Consommation d'énergie dépassée dans la Zone 3", time: "14/03 23:23", severity: "orange" },
  { id: 2, title: "Niveau de déchets critique dans la Zone 5", time: "14/03 22:53", severity: "red" },
  { id: 3, title: "Flux de circulation élevé sur l'Avenue Centrale", time: "14/03 21:38", severity: "yellow" },
  { id: 4, title: "Sécurité en dessous des normes dans la Zone 2", time: "14/03 20:38", severity: "blue" },
  { id: 5, title: "Fuite d'eau détectée sur le réseau principal", time: "14/03 20:08", severity: "orange" },
];

const mockAlerts = [
  { id: 1, message: 'Alerte critique sur le serveur', type: 'critical', resolved: false },
  { id: 2, message: 'Mise à jour disponible', type: 'info', resolved: true },
  { id: 3, message: 'Espace disque faible', type: 'warning', resolved: false }
];

export { energyData, energyOptions, trafficData, trafficOptions, metricsData, wasteLevels, initialActiveAlerts, mockAlerts };
