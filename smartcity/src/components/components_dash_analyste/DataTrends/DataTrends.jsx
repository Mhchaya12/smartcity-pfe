import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { generateLabels, generateRandomData, getChartOptions } from '../../../data/analysteData'; // Importer depuis analysteData
import './DataTrends.css';

const DataTrends = ({ period, sensorType }) => {
  const [chartType, setChartType] = useState('line');
  const [energyData, setEnergyData] = useState({
    labels: [],
    datasets: [],
  });
  const [trafficData, setTrafficData] = useState({
    labels: [],
    datasets: [],
  });

  // Générer des données simulées basées sur la période sélectionnée
  useEffect(() => {
    const labels = generateLabels(period);

    // Simulation de données d'énergie
    setEnergyData({
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

  const options = getChartOptions(sensorType, period);

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
      <div className="chart-container">{renderChart()}</div>
      <div className="data-trends-footer">
        <div className="insight-badge">
          <span className="badge">+2.4%</span> par rapport à la période précédente
        </div>
        <div className="data-source">Source: Capteurs SmartCity en temps réel</div>
      </div>
    </div>
  );
};

export default DataTrends;