import React, { useState, useEffect } from 'react';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import Header from '../../components/components_dash_admin/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



import axios from 'axios';
import "../../styles/Alerts.css";

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('Actives');
  const [searchTerm, setSearchTerm] = useState('');


  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
    // Set up polling for real-time updates
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/alerts');
      console.log('Total alerts from API:', response.data.length);
      
      const allAlerts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const active = allAlerts.filter(alert => !alert.resolu);
      const resolved = allAlerts.filter(alert => alert.resolu);
      
      console.log('Active alerts:', active.length);
      console.log('Resolved alerts:', resolved.length);
      console.log('Total after filtering:', active.length + resolved.length);
      
      setActiveAlerts(active);
      setResolvedAlerts(resolved);
    } catch (error) {
      console.error('Error fetching alerts:', error);





    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:5050/api/alerts/${id}`, { resolu: true });
      // Rafraîchir les alertes après la résolution
      fetchAlerts();




    } catch (error) {
      console.error('Error resolving alert:', error);





    }
  };

  // Filter alerts based on search term
  const filteredActiveAlerts = activeAlerts.filter((alert) =>
    `${alert.description} ${alert.local}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResolvedAlerts = resolvedAlerts.filter((alert) =>
    `${alert.description} ${alert.local}`.toLowerCase().includes(searchTerm.toLowerCase())
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
              {filteredActiveAlerts.length === 0 ? (
                <div className="no-alerts">Aucune alerte active</div>
              ) : (
                filteredActiveAlerts.map((alert) => (
                  <div key={alert._id} className={`alert-card ${alert.etat.toLowerCase()}`}>
                    <div className="alert-content">
                      <div className={`alert-indicator ${alert.etat.toLowerCase()}`}></div>
                      <div className="alert-details">
                        <p className="alert-title">{alert.description} - {alert.local}</p>
                        <p className="alert-time">{new Date(alert.date).toLocaleString()}</p>








                      </div>







                    </div>
                    <button className="resolve-button" onClick={() => handleResolve(alert._id)}>
                      Résoudre
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'Résolues' && (
          <div className="section">
            <h2>Résolues</h2>
            <p className="subtitle">Alertes déjà traitées</p>
            <div className="alert-list">
              {filteredResolvedAlerts.length === 0 ? (
                <div className="no-alerts">Aucune alerte résolue</div>
              ) : (
                filteredResolvedAlerts.map((alert) => (
                  <div key={alert._id} className={`alert-card resolved ${alert.etat.toLowerCase()}`}>
                    <div className="alert-content">
                      <div className={`alert-indicator ${alert.etat.toLowerCase()}`}></div>
                      <div className="alert-details">
                        <p className="alert-title">{alert.description} - {alert.local}</p>
                        <p className="alert-time">{new Date(alert.date).toLocaleString()}</p>











                      </div>
                    </div>
                    <div className="resolved-check">✔ Résolu</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;