import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './DataTrends.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataTrends = ({ period, sensorType, sensorData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // Configuration des couleurs et des labels pour chaque type de capteur
  const sensorConfig = {
    Dechet: {
      label: 'Niveau de remplissage (%)',
      color: 'rgb(75, 192, 192)',
      bgColor: 'rgba(75, 192, 192, 0.2)',
      max: 100
    },
    Energie: {
      label: 'Consommation (kWh)',
      color: 'rgb(255, 99, 132)',
      bgColor: 'rgba(255, 99, 132, 0.2)',
      max: 6500
    },
    Securite: {
      label: 'Détection d\'anomalies (%)',
      color: 'rgb(54, 162, 235)',
      bgColor: 'rgba(54, 162, 235, 0.2)',
      max: 100
    },
    Transport: {
      label: 'Flux (véhicules/h)',
      color: 'rgb(255, 206, 86)',
      bgColor: 'rgba(255, 206, 86, 0.2)',
      max: 1000
    }
  };

  useEffect(() => {
    if (!sensorData || sensorData.length === 0) return;

    // Filtrer les données en fonction du type de capteur sélectionné
    const filteredData = sensorType === 'all' 
      ? sensorData 
      : sensorData.filter(sensor => sensor.type === sensorType);

    // Grouper les données par type de capteur
    const groupedData = filteredData.reduce((acc, sensor) => {
      if (!acc[sensor.type]) {
        acc[sensor.type] = [];
      }
      acc[sensor.type].push({
        timestamp: new Date(sensor.lastUpdate),
        value: sensor.data
      });
      return acc;
    }, {});

    // Trier les données par timestamp
    Object.keys(groupedData).forEach(type => {
      groupedData[type].sort((a, b) => a.timestamp - b.timestamp);
    });

    // Préparer les données pour le graphique
    const datasets = Object.entries(groupedData).map(([type, data]) => {
      const config = sensorConfig[type] || {
        label: type,
        color: 'rgb(128, 128, 128)',
        bgColor: 'rgba(128, 128, 128, 0.2)',
        max: 100
      };

      return {
        label: config.label,
        data: data.map(d => d.value),
        borderColor: config.color,
        backgroundColor: config.bgColor,
        tension: 0.4,
        fill: true
      };
    });

    // Utiliser les 10 dernières valeurs pour l'affichage en temps réel
    const maxDataPoints = 10;
    const labels = Object.values(groupedData)[0]?.slice(-maxDataPoints).map(d => 
      new Date(d.timestamp).toLocaleTimeString()
    ) || [];

    // Limiter les données à 10 points pour chaque type
    const limitedDatasets = datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.slice(-maxDataPoints)
    }));

    setChartData({
      labels,
      datasets: limitedDatasets
    });
  }, [sensorData, sensorType]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Données en temps réel'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  return (
    <div className="data-trends-container">
      <div className="chart-container">
        {chartData.datasets.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="no-data-message">
            Aucune donnée disponible pour la période sélectionnée
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTrends;