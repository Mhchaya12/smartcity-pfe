import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './SensorAnalysis.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const SensorAnalysis = ({ data = [], period }) => {
  // Ensure data is an array even if it's undefined
  const safeData = Array.isArray(data) ? data : [];
  
  // Group data by type and status for analysis
  const sensorTypes = [...new Set(safeData.map(item => item.type))];
  
  // Count sensors by type
  const typeCounts = sensorTypes.map(type => ({
    type,
    count: safeData.filter(item => item.type === type).length,
    alertCount: safeData.filter(item => item.type === type && item.status !== 'Normal').length
  }));

  // Prepare data for doughnut chart with fallback for empty data
  const chartData = {
    labels: sensorTypes.length > 0 ? sensorTypes : ['No Data'],
    datasets: [
      {
        label: 'Nombre de capteurs',
        data: sensorTypes.length > 0 && typeCounts.length > 0
          ? typeCounts.map(item => item.count) 
          : [1], // Provide dummy data when no real data exists
        backgroundColor: [
          'rgba(0, 180, 216, 0.7)',
          'rgba(238, 108, 77, 0.7)',
          'rgba(60, 188, 152, 0.7)',
          'rgba(103, 58, 183, 0.7)'
        ],
        borderColor: [
          'rgba(0, 180, 216, 1)',
          'rgba(238, 108, 77, 1)',
          'rgba(60, 188, 152, 1)',
          'rgba(103, 58, 183, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Répartition des capteurs (${period || 'day'})`,
      },
    },
  };

  return (
    <div className="sensor-analysis">
      <div className="sensor-analysis-header">
        <h3>Analyse des Capteurs</h3>
      </div>
      
      <div className="sensor-analysis-content">
        <div className="chart-container">
          <Doughnut data={chartData} options={options} />
        </div>
        
        <div className="sensor-stats">
          {typeCounts.length > 0 ? (
            typeCounts.map((item, index) => (
              <div key={index} className="sensor-stat-card">
                <div className="sensor-type-label">{item.type}</div>
                <div className="sensor-count">{item.count} capteurs</div>
                <div className="alert-ratio">
                  <span className={item.alertCount > 0 ? "alert-warning" : "alert-normal"}>
                    {item.alertCount} alertes
                  </span>
                  {item.count > 0 && (
                    <span className="ratio-percentage">
                      ({Math.round((item.alertCount / item.count) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              <p>Aucune donnée disponible pour cette sélection</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="sensor-analysis-footer">
        <div className="status-legend">
          <div className="legend-item">
            <span className="status-indicator normal"></span>
            <span className="status-label">Normal</span>
          </div>
          <div className="legend-item">
            <span className="status-indicator alert"></span>
            <span className="status-label">Alerte</span>
          </div>
          <div className="legend-item">
            <span className="status-indicator critical"></span>
            <span className="status-label">Critique</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorAnalysis;