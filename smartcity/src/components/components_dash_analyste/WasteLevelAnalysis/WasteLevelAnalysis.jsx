import React, { forwardRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  wasteLevelData,
  getWasteLevelColors,
  getWasteLevelChartOptions,
  COLLECTION_DATA,
  wasteLevelDatasetConfig,
} from '../../../data/analysteData';
import './WasteLevelAnalysis.css';

const WasteLevelAnalysis = forwardRef((props, ref) => {
  const [selectedZone, setSelectedZone] = useState('all');

  const { zones, wasteLevels, thresholds } = wasteLevelData;

  // Filter data based on selected zone
  const zonesData = selectedZone === 'all' ? zones : [selectedZone];
  const levelsData = zonesData.map((zone) => wasteLevels[zone]);

  // Chart data
  const chartData = {
    labels: zonesData,
    datasets: [
      {
        ...wasteLevelDatasetConfig,
        data: levelsData,
        backgroundColor: levelsData.map((level) => getWasteLevelColors(level, thresholds).backgroundColor),
        borderColor: levelsData.map((level) => getWasteLevelColors(level, thresholds).borderColor),
      },
    ],
  };

  const options = getWasteLevelChartOptions(thresholds);

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

  return (
    <div className="waste-level-analysis" ref={ref}>
      <div className="waste-level-header">
        <h3>Analyse des Niveaux de Déchets</h3>
        <div className="zone-filter">
          <select value={selectedZone} onChange={handleZoneChange}>
            <option value="all">Toutes les zones</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
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
                <div className="waste-status">
                  {status === 'critical' ? 'Critique' : status === 'warning' ? 'Attention' : 'Normal'}
                </div>
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