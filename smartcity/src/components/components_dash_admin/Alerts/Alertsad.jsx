import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AlertType, initialActiveAlerts } from '../../../data/adminData'; // Import from adminData.js
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setAlerts(initialActiveAlerts); // Use imported data
        setError(null);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Échec de la récupération des alertes');
      console.error('Erreur lors de la récupération des alertes:', err);
      setLoading(false);
    }
  };

  const handleToggleResolved = (id) => {
    setAlerts(alerts.map((alert) =>
      alert.id === id ? { ...alert, resolved: !alert.resolved } : alert
    ));
  };

  const handleDeleteAlert = (e, id) => {
    e.stopPropagation();
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  if (loading) {
    return (
      <div className="alerts-card">
        <h3>Alertes en Temps Réel</h3>
        <div className="loading">Chargement des alertes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alerts-card">
        <h3>Alertes en Temps Réel</h3>
        <div className="error">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="alerts-card">
      <Link to="/alertsad">
        <h3>Alertes en Temps Réel</h3>
      </Link>
      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">Aucune alerte à afficher</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.type.toLowerCase()} ${alert.resolved ? 'resolved' : ''}`}
              onClick={() => handleToggleResolved(alert.id)}
            >
              <FontAwesomeIcon
                icon={alert.resolved ? faCheckCircle : faExclamationCircle}
                className="alert-icon"
              />
              <span className="alert-message">
                {alert.message} - {alert.location} ({alert.timestamp.toLocaleString()})
              </span>
              {alert.resolved && <span className="resolved-tag">Résolue</span>}
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteAlert(e, alert.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;