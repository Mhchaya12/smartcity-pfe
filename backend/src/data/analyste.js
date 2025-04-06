// analyse.js

// Générer des étiquettes en fonction de la période
const generateLabels = (period) => {
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
  
  // Générer des données aléatoires
  const generateRandomData = (min, max, count) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min));
  };
  
  // Générer les données d'énergie
  const generateEnergyData = (period) => {
    const labels = generateLabels(period);
    return {
      labels,
      datasets: [
        {
          label: "Consommation d'Énergie",
          data: generateRandomData(300, 500, labels.length),
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Seuil Critique',
          data: Array(labels.length).fill(450),
          borderColor: 'rgba(255, 99, 132, 1)',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
      ],
    };
  };
  
  // Générer les données de trafic
  const generateTrafficData = (period) => {
    const labels = generateLabels(period);
    return {
      labels,
      datasets: [
        {
          label: 'Voitures',
          data: generateRandomData(3000, 5500, labels.length),
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
        },
        {
          label: 'Bus',
          data: generateRandomData(800, 1300, labels.length),
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        },
        {
          label: 'Vélos',
          data: generateRandomData(300, 800, labels.length),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
      ],
    };
  };
  
  // Générer les options pour Chart.js
  const generateChartOptions = (sensorType, period) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: sensorType === 'all' || sensorType === 'Énergie' 
          ? `Tendances de Consommation d'Énergie (${period})` 
          : `Flux de Circulation (${period})`,
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
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
  
  module.exports = {
    generateLabels,
    generateRandomData,
    generateEnergyData,
    generateTrafficData,
    generateChartOptions, // Nouvelle fonction exportée
  };