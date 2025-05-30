import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './WasteLevelAnalysis.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WasteLevelAnalysis = React.forwardRef(({ wasteLevels }, ref) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Niveau de remplissage',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });

  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    normal: 0
  });

  useEffect(() => {
    if (!wasteLevels || wasteLevels.length === 0) return;

    // Group data by location
    const groupedData = wasteLevels.reduce((acc, sensor) => {
      if (!acc[sensor.location]) {
        acc[sensor.location] = [];
      }
      acc[sensor.location].push(sensor.data);
      return acc;
    }, {});

    // Calculate average level for each location
    const averages = Object.entries(groupedData).map(([location, levels]) => ({
      location,
      average: levels.reduce((sum, level) => sum + level, 0) / levels.length
    }));

    // Sort by average level
    averages.sort((a, b) => b.average - a.average);

    // Update chart data
    setChartData({
      labels: averages.map(item => item.location),
      datasets: [{
        ...chartData.datasets[0],
        data: averages.map(item => item.average)
      }]
    });

    // Calculate statistics
    const total = wasteLevels.length;
    const critical = wasteLevels.filter(sensor => sensor.data >= 85).length;
    const warning = wasteLevels.filter(sensor => sensor.data >= 70 && sensor.data < 85).length;
    const normal = total - critical - warning;

    setStats({
      total,
      critical,
      warning,
      normal
    });
  }, [wasteLevels]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Niveaux de remplissage des conteneurs'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Niveau (%)'
        }
      }
    }
  };

  return (
    <div className="waste-level-analysis-container">
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total des conteneurs</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Niveau critique</h4>
          <p className="stat-value critical">{stats.critical}</p>
        </div>
        <div className="stat-card">
          <h4>Niveau d'avertissement</h4>
          <p className="stat-value warning">{stats.warning}</p>
        </div>
        <div className="stat-card">
          <h4>Niveau normal</h4>
          <p className="stat-value normal">{stats.normal}</p>
        </div>
      </div>

      <div className="chart-container">
        {stats.total > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="no-data-message">
            Aucune donnée disponible pour les niveaux de déchets
          </div>
        )}
      </div>
    </div>
  );
});

WasteLevelAnalysis.displayName = 'WasteLevelAnalysis';

export default WasteLevelAnalysis;