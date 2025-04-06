import React, { forwardRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './WasteLevelAnalysis.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteLevelAnalysis = forwardRef((props, ref) => {
  const [selectedZone, setSelectedZone] = useState('all');

  // Sample waste level data
  const zones = ['Avenue Habib-Bourguiba', 'Rue de Marseille', 'Rue de Rome', 'Avenue Mohammed-V', 'Rue Charles-de-Gaulle'];
  const wasteLevels = {
  'Avenue Habib-Bourguiba': 85,
  'Rue de Marseille': 45,
  'Rue de Rome': 65,
  'Avenue Mohammed-V': 30,
  'Rue Charles-de-Gaulle': 75
};

  // Define threshold levels
  const thresholds = {
    warning: 65,
    critical: 80
  };

  // Filter data based on selected zone
  const zonesData = selectedZone === 'all' ? zones : [selectedZone];
  const levelsData = zonesData.map(zone => wasteLevels[zone]);

  // Chart data
  const chartData = {
    labels: zonesData,
    datasets: [
      {
        label: 'Niveau de remplissage (%)',
        data: levelsData,
        backgroundColor: levelsData.map(level => {
          if (level >= thresholds.critical) return 'rgba(231, 76, 60, 0.7)'; // Red for critical
          if (level >= thresholds.warning) return 'rgba(243, 156, 18, 0.7)'; // Orange for warning
          return 'rgba(46, 204, 113, 0.7)'; // Green for normal
        }),
        borderColor: levelsData.map(level => {
          if (level >= thresholds.critical) return 'rgba(231, 76, 60, 1)';
          if (level >= thresholds.warning) return 'rgba(243, 156, 18, 1)';
          return 'rgba(46, 204, 113, 1)';
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            let status = 'Normal';
            if (value >= thresholds.critical) status = 'Critique';
            else if (value >= thresholds.warning) status = 'Attention';
            return [`Niveau: ${value}%`, `Statut: ${status}`];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };

  // Extract zone status
  const getZoneStatus = (zone) => {
    const level = wasteLevels[zone];
    if (level >= thresholds.critical) return 'critical';
    if (level >= thresholds.warning) return 'warning';
    return 'normal';
  };

  const COLLECTION_DATA = {
    nextCollection: {
      label: "Prochaine collecte:",
      value: "Demain, 08:00"
    },
    lastUpdate: {
      label: "Dernière mise à jour:",
      value: "19/03/2025, 14:30"
    }
  };

  return (
    <div className="waste-level-analysis" ref={ref}>
      <div className="waste-level-header">
        <h3>Analyse des Niveaux de Déchets</h3>
        <div className="zone-filter">
          <select value={selectedZone} onChange={handleZoneChange}>
            <option value="all">Toutes les zones</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="waste-level-content">
        <div className="chart-container">
          <Bar data={chartData} options={options} />
        </div>
        
        <div className="waste-level-stats">
          {zones.map((zone) => {
            const status = getZoneStatus(zone);
            return (
              <div key={zone} className={`waste-stat-card ${status}`}>
                <div className="waste-zone-label">{zone}</div>
                <div className="waste-level-indicator">
                  <div className="level-bar">
                    <div 
                      className="level-fill" 
                      style={{ width: `${wasteLevels[zone]}%` }}
                    ></div>
                  </div>
                  <div className="level-value">{wasteLevels[zone]}%</div>
                </div>
                <div className="waste-status">{
                  status === 'critical' ? 'Critique' :
                  status === 'warning' ? 'Attention' : 'Normal'
                }</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="waste-level-footer">
        <div className="collection-info">
          <div className="next-collection">
            <span className="label">{COLLECTION_DATA.nextCollection.label}</span>
            <span className="value">{COLLECTION_DATA.nextCollection.value}</span>
          </div>
          <div className="last-update">
            <span className="label">{COLLECTION_DATA.lastUpdate.label}</span>
            <span className="value">{COLLECTION_DATA.lastUpdate.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WasteLevelAnalysis;