import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Charts.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Charts = ({ energie, transport }) => {
  const [energyData, setEnergyData] = useState({
    labels: [],
    datasets: [{
      label: 'Consommation (kWh)',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
      fill: true
    }]
  });

  const [trafficData, setTrafficData] = useState({
    labels: [],
    datasets: [{
      label: 'Flux (véhicules)',
      data: [],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
      fill: true
    }]
  });

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    
    if (energie) {
      setEnergyData(prev => ({
        labels: [...prev.labels, timestamp].slice(-10),
        datasets: [{
          ...prev.datasets[0],
          data: [...prev.datasets[0].data, energie.seuilConsomation].slice(-10)
        }]
      }));
    }

    if (transport) {
      setTrafficData(prev => ({
        labels: [...prev.labels, timestamp].slice(-10),
        datasets: [{
          ...prev.datasets[0],
          data: [...prev.datasets[0].data, transport.fluxActuelle].slice(-10)
        }]
      }));
    }
  }, [energie, transport]);

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

  const transportOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        max: 400
      }
    }
  };

  return (
    <div className="charts">
      <div className="chart-card">
        <h3>Consommation d'Énergie</h3>
        <div className="chart-container">
          <Line data={energyData} options={options} />
        </div>
      </div>
      <div className="chart-card">
        <h3>Flux de Transport</h3>
        <div className="chart-container">
          <Line data={trafficData} options={transportOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;