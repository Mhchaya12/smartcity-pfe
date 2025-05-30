import React, { useRef, useState, useEffect } from 'react';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import Header from '../../components/components_dash_admin/Header/Header';
import Charts from '../../components/components_dash_admin/Charts/Charts';
import Alerts from '../../components/components_dash_admin/Alerts/Alertsad';
import Metrics from '../../components/components_dash_admin/Metrics/Metrics';
import WasteLevels from '../../components/components_dash_admin/WasteLevels/WasteLevels';
import { SensorStatus } from '../../data/adminData';
import '../../styles/Dashboard.css';

const Dashboard = ({energie, dechets, transport, securite}) => {
  const [donneesCapteurs, setDonneesCapteurs] = useState([]);
  const [historiquesActifs, setHistoriquesActifs] = useState([]);
  const [historiquesTraites, setHistoriquesTraites] = useState([]);
  const [ongletActif, setOngletActif] = useState('Actifs');
  const [vueActive, setVueActive] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const wasteLevelsRef = useRef(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    // Mettre à jour les données des capteurs lorsque de nouvelles données sont reçues
    const newData = [];
    
    if (energie) {
      newData.push({
        id: energie._id,
        type: 'Énergie',
        location: energie.localisation,
        data: `${energie.seuilConsomation} kWh`,
        status: energie.status,
        date: new Date(energie.dernier_mise_a_jour).toLocaleString('fr-FR'),
        pourcentage: energie.pourcentage
      });
    }
    
    if (dechets) {
      newData.push({
        id: dechets._id,
        type: 'Déchets',
        location: dechets.localisation,
        data: `${dechets.niveaux_remplissage}%`,
        status: dechets.status,
        date: new Date(dechets.dernier_mise_a_jour).toLocaleString('fr-FR'),
        pourcentage: dechets.pourcentage
      });
    }
    
    if (transport) {
      newData.push({
        id: transport._id,
        type: 'Transport',
        location: transport.localisation,
        data: `${transport.fluxActuelle} véhicules`,
        status: transport.status,
        date: new Date(transport.dernier_mise_a_jour).toLocaleString('fr-FR'),
        pourcentage: transport.pourcentage
      });
    }
    
    if (securite) {
      newData.push({
        id: securite._id,
        type: 'Sécurité',
        location: securite.localisation,
        data: `${securite.anomalieDetection} anomalies`,
        status: securite.status,
        date: new Date(securite.dernier_mise_a_jour).toLocaleString('fr-FR'),
        pourcentage: securite.pourcentage
      });
    }

    // Mettre à jour les données des capteurs en conservant l'historique
    setDonneesCapteurs(prevData => {
      const updatedData = [...prevData];
      newData.forEach(newItem => {
        const existingIndex = updatedData.findIndex(item => item.id === newItem.id);
        if (existingIndex !== -1) {
          // Conserver l'ancienne entrée comme historique
          const oldEntry = { ...updatedData[existingIndex] };
          oldEntry.isHistorical = true;
          updatedData[existingIndex] = newItem;
          updatedData.push(oldEntry);
        } else {
          updatedData.push(newItem);
        }
      });
      return updatedData;
    });
    
    // Mettre à jour les historiques actifs
    const newActifs = newData.filter(item => item.status !== SensorStatus.OPERATIONAL);
    setHistoriquesActifs(prevActifs => {
      const uniqueActifs = [...prevActifs];
      newActifs.forEach(newItem => {
        const existingIndex = uniqueActifs.findIndex(item => item.id === newItem.id);
        if (existingIndex !== -1) {
          uniqueActifs[existingIndex] = newItem;
        } else {
          uniqueActifs.push(newItem);
        }
      });
      return uniqueActifs;
    });
  }, [energie, dechets, transport, securite]);

  const donneesFiltrees = donneesCapteurs
    .filter(item => 
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const gererChangementVue = () => {
    setVueActive(vueActive === 'dashboard' ? 'historique' : 'dashboard');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case SensorStatus.OPERATIONAL:
        return 'status-normal';
      case SensorStatus.WARNING:
        return 'status-warning';
      case SensorStatus.CRITICAL:
        return 'status-critical';
      case SensorStatus.MAINTENANCE:
        return 'status-maintenance';
      case SensorStatus.OFFLINE:
        return 'status-offline';
      default:
        return 'status-normal';
    }
  };

  return (
    <Layout>
      <Header
        title="Tableau de bord"
        subtitle="Bienvenue, Chayma ! Voici ce qui se passe aujourd'hui."
      />
      <div className="dashboard">
        <div className="controls">
          <button
            onClick={gererChangementVue}
            className="view-toggle-button"
          >
            {vueActive === 'dashboard' ? "Voir l'historique" : 'Retour au tableau de bord'}
          </button>
        </div>

        {vueActive === 'dashboard' ? (
          <>
            <Metrics 
              energie={energie} 
              dechets={dechets} 
              transport={transport} 
              securite={securite} 
            />
            <Charts energie={energie} transport={transport} />
            <div className="bottom-section">
              <Alerts />
              <div ref={wasteLevelsRef}>
                <WasteLevels dechets={dechets} />
              </div>
            </div>
          </>
        ) : (
          <div className="historique-view">
            <h2>Historique des capteurs</h2>
            <div className="search-container">
              <select
                value={searchTerm}
                onChange={handleSearch}
                className="search-select"
              >
                <option value="">Tous les types</option>
                <option value="Énergie">Énergie</option>
                <option value="Déchets">Déchets</option>
                <option value="Transport">Transport</option>
                <option value="Sécurité">Sécurité</option>
              </select>
            </div>
            <div className="table-container">
              <table className="historique-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Lieu</th>
                    <th>Données</th>
                    <th>Statut</th>
                    <th>Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {donneesFiltrees.map((item) => (
                    <tr key={`${item.id}-${item.date}`} className={item.isHistorical ? 'historical-entry' : ''}>
                      <td>{item.date}</td>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.location}</td>
                      <td>{item.data}</td>
                      <td>
                        <span className={getStatusClass(item.status)}>{item.status}</span>
                      </td>
                      <td>{item.pourcentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;