import React, { useState } from 'react';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import Header from '../../components/components_dash_admin/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "../../styles/Alerts.css";

const Alerts = ({
  historiquesActifs,
  historiquesTraites,
  gererResolution,
  ongletActif,
  setOngletActif,
}) => {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      title: "Consommation d'énergie dépassée dans la Rue de Marseille",
      time: "14/03 23:23",
      severity: "orange",
      resolved: false,
    },
    {
      id: 2,
      title: "Niveau de déchets critique dans l'Avenue Mohammed-V",
      time: "14/03 22:53",
      severity: "red",
      resolved: false,
    },
    {
      id: 3,
      title: "Flux de circulation élevé sur l'Avenue Centrale",
      time: "14/03 21:38",
      severity: "yellow",
      resolved: false,
    },
    {
      id: 4,
      title: "Sécurité en dessous des normes dans l'Avenue Habib-Bourguiba",
      time: "14/03 20:38",
      severity: "blue",
      resolved: false,
    },
    {
      id: 5,
      title: "Fuite d'eau détectée sur le réseau principal",
      time: "14/03 20:08",
      severity: "orange",
      resolved: false,
    },
  ]);

  const [resolvedAlerts, setResolvedAlerts] = useState([
    { id: 6, title: "Panne résolue dans Zone 1", time: "14/03 19:45", severity: "green", resolved: true },
  ]);
  const [activeTab, setActiveTab] = useState('Actives');
  const [searchTerm, setSearchTerm] = useState('');

  const handleResolve = (id) => {
    const alertToResolve = activeAlerts.find((alert) => alert.id === id);
    if (alertToResolve) {
      setActiveAlerts(activeAlerts.filter((alert) => alert.id !== id));
      setResolvedAlerts([...resolvedAlerts, { ...alertToResolve, resolved: true }]);
      setActiveTab('Résolues'); // Switch to Resolved tab
    }
  };

  // Filter alerts based on search term
  const filteredActiveAlerts = activeAlerts.filter((alert) =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResolvedAlerts = resolvedAlerts.filter((alert) =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Header title="Alerts" subtitle="Bienvenue, Chayma ! Voici les informations d'aujourd'hui" />
      <div className="alerts-container">
        <h1>Gestion des Alertes</h1>
        <p>Définir les alertes des systèmes urbains</p>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'Actives' ? 'active' : ''}`}
            onClick={() => setActiveTab('Actives')}
          >
            Actives ({activeAlerts.length})
          </button>
          <button
            className={`tab ${activeTab === 'Résolues' ? 'active' : ''}`}
            onClick={() => setActiveTab('Résolues')}
          >
            Résolues ({resolvedAlerts.length})
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
                <div key={alert.id} className={`alert-card ${alert.severity}`}>
                  <div className="alert-content">
                    <div className={`alert-indicator ${alert.severity}`}></div>
                    <div className="alert-details">
                      <p className="alert-title">{alert.title}</p>
                      <p className="alert-time">{alert.time}</p>
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
                <div key={alert.id} className={`alert-card resolved ${alert.severity}`}>
                  <div className="alert-content">
                    <div className={`alert-indicator ${alert.severity}`}></div>
                    <div className="alert-details">
                      <p className="alert-title">{alert.title}</p>
                      <p className="alert-time">{alert.time}</p>
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