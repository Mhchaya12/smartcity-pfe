import React from 'react';
import { zones, wasteLevels } from '../../../data/adminData'; // Import from adminData.js
import './WasteLevels.css';

const WasteLevels = () => {
  return (
    <div className="waste-levels-card">
      <h3>Niveau de Déchets par Zone</h3>
      <div className="waste-levels-list">
        {zones.map((zone, index) => (
          <div key={index} className="waste-level-item">
            <span>{zone}</span>
            <div className="progress-bars">
              <div
                className="progress-bar recyclable"
                style={{ width: `${wasteLevels[zone]}%` }}
              ></div>
            </div>
            <span>{wasteLevels[zone]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteLevels;