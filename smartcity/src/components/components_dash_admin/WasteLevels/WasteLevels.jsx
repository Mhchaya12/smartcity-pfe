import React from 'react';
import './WasteLevels.css';
import { wasteLevels } from '../../../data/adminData';

const WasteLevels = () => {
  const getStatusClass = (level) => {
    if (level >= 80) return 'critical';
    if (level >= 60) return 'warning';
    return 'normal';
  };

  const getStatusText = (level) => {
    if (level >= 80) return 'Critical';
    if (level >= 60) return 'Warning';
    return 'Normal';
  };

  return (
    <div className="waste-levels-card">
      <h3>Waste Levels</h3>
      <div className="waste-levels-list">
        {wasteLevels.map((item, index) => {
          const statusClass = getStatusClass(item.level);
          const statusText = getStatusText(item.level);
          
          return (
            <div key={index} className="waste-level-item">
              <span>{item.location}</span>
              <div className="progress-bars">
                <div 
                  className={`progress-bar ${statusClass}`}
                  style={{ width: `${item.level}%` }}
                />
              </div>
              <span>{item.level}%</span>
              <div className={`status-indicator ${statusClass}`}>
                <div className="status-dot" />
                {statusText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WasteLevels;