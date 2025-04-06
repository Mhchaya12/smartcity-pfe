import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Alerts.css';

// Supposons une enum AlertType pour type
const AlertType = {
  INFO: "INFO",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
  NOTICE: "NOTICE",
};

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
      const initialActiveAlerts = [
        {
          id: 1,
          timestamp: new Date("2025-03-14T23:23:00"),
          type: AlertType.WARNING,
          message: "Consommation d'énergie dépassée",
          location: "Rue de Marseille",
          sensorId: "",
          resolved: false,
        },
        {
          id: 2,
          timestamp: new Date("2025-03-14T22:53:00"),
          type: AlertType.CRITICAL,
          message: "Niveau de déchets critique",
          location: "Avenue Mohammed-V",
          sensorId: "",
          resolved: false,
        },
        {
          id: 3,
          timestamp: new Date("2025-03-14T21:38:00"),
          type: AlertType.INFO,
          message: "Flux de circulation élevé",
          location: "Avenue Centrale",
          sensorId: "",
          resolved: false,
        },
        {
          id: 4,
          timestamp: new Date("2025-03-14T20:38:00"),
          type: AlertType.NOTICE,
          message: "Sécurité en dessous des normes",
          location: "Avenue Habib-Bourguiba",
          sensorId: "",
          resolved: false,
        },
      ];

      setTimeout(() => {
        setAlerts(initialActiveAlerts);
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