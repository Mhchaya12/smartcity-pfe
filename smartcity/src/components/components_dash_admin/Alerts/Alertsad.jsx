import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/alerts');
      // Trier les alertes par date et ne garder que les 2 plus récentes
      const sortedAlerts = response.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);
      setAlerts(sortedAlerts);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des alertes:', err);
      setError('Échec de la récupération des alertes');
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const handleToggleResolved = async (id) => {
    try {
      await axios.put(`http://localhost:5050/api/alerts/${id}/resolve`);
      // Rafraîchir les alertes pour avoir les 2 plus récentes
      fetchAlerts();
    } catch (err) {
      console.error('Erreur lors de la résolution de l\'alerte:', err);
    }
  };

  const handleDeleteAlert = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5050/api/alerts/${id}`);
      // Rafraîchir les alertes pour avoir les 2 plus récentes
      fetchAlerts();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'alerte:', err);
    }
  };

  if (loading && !alerts.length) {
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
              key={alert._id}
              className={`alert-item ${alert.etat.toLowerCase()} ${alert.resolu ? 'resolved' : ''}`}
              onClick={() => handleToggleResolved(alert._id)}
            >
              <FontAwesomeIcon
                icon={alert.resolu ? faCheckCircle : faExclamationCircle}
                className="alert-icon"
              />
              <span className="alert-message">
                {alert.description} - {alert.local} ({new Date(alert.date).toLocaleString()})
              </span>
              {alert.resolu && <span className="resolved-tag">Résolue</span>}
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteAlert(e, alert._id)}
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