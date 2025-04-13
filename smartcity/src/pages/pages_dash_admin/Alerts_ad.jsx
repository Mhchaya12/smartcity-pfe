import React, { useState } from 'react';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import Header from '../../components/components_dash_admin/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { activeAlerts, resolvedAlerts } from '../../data/adminData'; // Import from adminData.js
import "../../styles/Alerts.css";

const Alerts = ({
  historiquesActifs = activeAlerts, // Default to imported data if prop not provided
  historiquesTraites = resolvedAlerts, // Default to imported data if prop not provided
  gererResolution,
  ongletActif,
  setOngletActif,
}) => {
  const [activeAlertsState, setActiveAlerts] = useState(historiquesActifs);
  const [resolvedAlertsState, setResolvedAlerts] = useState(historiquesTraites);
  const [activeTab, setActiveTab] = useState(ongletActif || 'Actives');
  const [searchTerm, setSearchTerm] = useState('');

  const handleResolve = (id) => {
    const alertToResolve = activeAlertsState.find((alert) => alert.id === id);
    if (alertToResolve) {
      setActiveAlerts(activeAlertsState.filter((alert) => alert.id !== id));
      setResolvedAlerts([...resolvedAlertsState, { ...alertToResolve, resolved: true }]);
      setActiveTab('Résolues'); // Switch to Resolved tab
      if (gererResolution) {
        gererResolution(id); // Call prop function if provided
      }
    }
  };

  // Filter alerts based on search term
  const filteredActiveAlerts = activeAlertsState.filter((alert) =>
    `${alert.message} ${alert.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResolvedAlerts = resolvedAlertsState.filter((alert) =>
    `${alert.message} ${alert.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sync activeTab with ongletActif prop if provided
  React.useEffect(() => {
    if (ongletActif && ongletActif !== activeTab) {
      setActiveTab(ongletActif);
    }
  }, [ongletActif]);

  return (
    <Layout>
      <Header title="Alerts" subtitle="Bienvenue, Chayma ! Voici les informations d'aujourd'hui" />
      <div className="alerts-container">
        <h1>Gestion des Alertes</h1>
        <p>Définir les alertes des systèmes urbains</p>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'Actives' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Actives');
              if (setOngletActif) setOngletActif('Actives');
            }}
          >
            Actives ({activeAlertsState.length})
          </button>
          <button
            className={`tab ${activeTab === 'Résolues' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Résolues');
              if (setOngletActif) setOngletActif('Résolues');
            }}
          >
            Résolues ({resolvedAlertsState.length})
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {activeTab === 'Actives' && (
          <div className="section">
            <h2>Alertes Actives</h2>
            <p className="subtitle">Alertes requérant votre attention</p>
            <div className="alert-list">
              {filteredActiveAlerts.map((alert) => (
                <div key={alert.id} className={`alert-card ${alert.type.toLowerCase()}`}>
                  <div className="alert-content">
                    <div className={`alert-indicator ${alert.type.toLowerCase()}`}></div>
                    <div className="alert-details">
                      <p className="alert-title">{alert.message} - {alert.location}</p>
                      <p className="alert-time">{alert.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                  <button className="resolve-button" onClick={() => handleResolve(alert.id)}>
                    Résoudre
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Résolues' && (
          <div className="section">
            <h2>Résolues</h2>
            <p className="subtitle">Alertes déjà traitées</p>
            <div className="alert-list">
              {filteredResolvedAlerts.map((alert) => (
                <div key={alert.id} className={`alert-card resolved ${alert.type.toLowerCase()}`}>
                  <div className="alert-content">
                    <div className={`alert-indicator ${alert.type.toLowerCase()}`}></div>
                    <div className="alert-details">
                      <p className="alert-title">{alert.message} - {alert.location}</p>
                      <p className="alert-time">{alert.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="resolved-check">✔ Résolu</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;