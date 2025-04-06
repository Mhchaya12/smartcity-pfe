import React from 'react';
import './WasteLevels.css';

const WasteLevels = () => {
  const zones = [
    'Avenue Habib-Bourguiba',
    'Rue de Marseille',
    'Rue de Rome',
    'Avenue Mohammed-V'
  ];

  const wasteLevels = {
    'Avenue Habib-Bourguiba': 75,  // From Zone 1 recyclable
    'Rue de Marseille': 90,        // From Zone 3 recyclable
    'Rue de Rome': 45,             // From Zone 4 recyclable
    'Avenue Mohammed-V': 80        // From Zone 5 recyclable
  };

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