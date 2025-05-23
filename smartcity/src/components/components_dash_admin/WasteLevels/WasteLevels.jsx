import React, { useEffect, useState } from 'react';
import './WasteLevels.css';

const WasteLevels = ({ dechets }) => {
  const [localisations, setLocalisations] = useState([
    { location: "Avenue Habib-Bourguiba", pourcentage: 0, status: 'normal' },
    { location: "Rue de Marseille", pourcentage: 0, status: 'normal' },
    { location: "Rue de Rome", pourcentage: 0, status: 'normal' },
    { location: "Avenue Mohammed-V", pourcentage: 0, status: 'normal' }
  ]);

  useEffect(() => {
    if (dechets && dechets.localisation) {
      setLocalisations(prevLocations => {
        return prevLocations.map(loc => {
          // Vérifier si cette localisation correspond aux données reçues
          const isCurrentLocation = loc.location === dechets.localisation;
          const pourcentage = isCurrentLocation ? (dechets.niveaux_remplissage || 0) : loc.pourcentage;
          
          return {
            ...loc,
            pourcentage: pourcentage,
            status: getStatusFromPourcentage(pourcentage)
          };
        });
      });
    }
  }, [dechets]);

  const getStatusFromPourcentage = (pourcentage) => {
    if (pourcentage === 0) return 'maintenance';
    if (pourcentage >= 80) return 'critical';
    if (pourcentage >= 60) return 'warning';
    if (pourcentage < 40) return 'normal';
    return 'maintenance';
  };

  const getStatusClass = (pourcentage) => {
    if (pourcentage === 0) return 'maintenance';
    if (pourcentage >= 80) return 'critical';
    if (pourcentage >= 60) return 'warning';
    if (pourcentage < 40) return 'normal';
    return 'maintenance';
  };

  const getStatusText = (pourcentage) => {
    if (pourcentage === 0) return 'Maintenance';
    if (pourcentage >= 80) return 'Critical';
    if (pourcentage >= 60) return 'Warning';
    if (pourcentage < 40) return 'Normal';
    return 'Maintenance';
  };

  if (!dechets) {
    return (
      <div className="waste-levels-card">
        <h3>Niveaux de Déchets</h3>
        <div className="waste-levels-list">
          <div className="no-data">
            <p>Connexion aux capteurs en cours...</p>
            <small>Veuillez patienter pendant la récupération des données</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="waste-levels-card">
      <h3>Niveaux de Déchets</h3>
      <div className="waste-levels-list">
        {localisations.map((loc, index) => (
          <div key={index} className="waste-level-item">
            <span>{loc.location}</span>
            <div className="progress-bars">
              <div 
                className={`progress-bar ${getStatusClass(loc.pourcentage)}`}
                style={{ width: `${loc.pourcentage}%` }}
              />
            </div>
            <span>{loc.pourcentage}%</span>
            <div className={`status-indicator ${getStatusClass(loc.pourcentage)}`}>
              <div className="status-dot" />
              {getStatusText(loc.pourcentage)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteLevels;