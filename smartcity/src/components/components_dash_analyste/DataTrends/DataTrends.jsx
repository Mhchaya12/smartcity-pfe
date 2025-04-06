import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './DataTrends.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const DataTrends = ({ period, sensorType }) => {
  const [chartType, setChartType] = useState('line');
  const [energyData, setEnergyData] = useState({
    labels: [],
    datasets: []
  });
  const [trafficData, setTrafficData] = useState({
    labels: [],
    datasets: []
  });

  // Générer des données simulées basées sur la période sélectionnée
  useEffect(() => {
    const generateLabels = () => {
      switch(period) {
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

    const generateRandomData = (min, max, count) => {
      return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min));
    };

    const labels = generateLabels();
    
    // Simulation de données d'énergie
    setEnergyData({
      labels,
      datasets: [
        {
          label: 'Consommation d\'Énergie',
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
        }
      ],
    });

    // Simulation de données de trafic
    setTrafficData({
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
    });
  }, [period]);

  const options = {
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
        font: { size: 16 }
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
          }
        }
      },
    },
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Déterminer quelles données afficher en fonction du type de capteur sélectionné
  const renderChart = () => {
    // Check if the data objects have datasets before trying to render
    const hasEnergyData = energyData && energyData.datasets && energyData.datasets.length > 0;
    const hasTrafficData = trafficData && trafficData.datasets && trafficData.datasets.length > 0;

    if (sensorType === 'all' || sensorType === 'Énergie') {
      if (!hasEnergyData) return <div>Chargement des données d'énergie...</div>;
      if (chartType === 'line') {
        return <Line data={energyData} options={options} />;
      } else {
        return <Bar data={energyData} options={options} />;
      }
    } else if (sensorType === 'Transport') {
      if (!hasTrafficData) return <div>Chargement des données de trafic...</div>;
      if (chartType === 'line') {
        return <Line data={trafficData} options={options} />;
      } else {
        return <Bar data={trafficData} options={options} />;
      }
    } else {
      // Fallback pour les autres types de capteurs
      if (!hasEnergyData) return <div>Chargement des données...</div>;
      if (chartType === 'line') {
        return <Line data={energyData} options={options} />;
      } else {
        return <Bar data={energyData} options={options} />;
      }
    }
  };

  return (
    <div className="data-trends">
      <div className="data-trends-header">
        <h3>Analyse des Tendances</h3>
        <div className="chart-type-toggle">
          <button 
            className={`chart-type-button ${chartType === 'line' ? 'active' : ''}`} 
            onClick={() => handleChartTypeChange('line')}
          >
            Ligne
          </button>
          <button 
            className={`chart-type-button ${chartType === 'bar' ? 'active' : ''}`} 
            onClick={() => handleChartTypeChange('bar')}
          >
            Barres
          </button>
        </div>
      </div>
      <div className="chart-container">
        {renderChart()}
      </div>
      <div className="data-trends-footer">
        <div className="insight-badge">
          <span className="badge">+2.4%</span> par rapport à la période précédente
        </div>
        <div className="data-source">
          Source: Capteurs SmartCity en temps réel
        </div>
      </div>
    </div>
  );
};

export default DataTrends;