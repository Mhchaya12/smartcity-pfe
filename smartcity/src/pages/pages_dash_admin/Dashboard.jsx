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
  const [termeRecherche, setTermeRecherche] = useState('');
  const [vueActive, setVueActive] = useState('dashboard');
  const wasteLevelsRef = useRef(null);

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

    console.log('New data being added:', newData);
    setDonneesCapteurs(prevData => {
      const updatedData = [...prevData, ...newData];
      console.log('Updated donneesCapteurs:', updatedData);
      return updatedData;
    });
    
    // Mettre à jour les historiques actifs
    const newActifs = newData.filter(item => item.status !== SensorStatus.OPERATIONAL);
    setHistoriquesActifs(prevActifs => [...prevActifs, ...newActifs]);
  }, [energie, dechets, transport, securite]);

  const donneesFiltrees = donneesCapteurs.filter(item => {
    console.log('Search term:', termeRecherche);
    console.log('Item type:', item.type);
    return item.type && item.type.toLowerCase().includes(termeRecherche.toLowerCase());
  });

  const gererChangementVue = () => {
    setVueActive(vueActive === 'dashboard' ? 'historique' : 'dashboard');
    setTermeRecherche('');
  };

  const gererRecherche = (e) => {
    console.log('Search input:', e.target.value);
    setTermeRecherche(e.target.value);
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
          {vueActive === 'historique' && (
            <input
              type="text"
              placeholder="Rechercher dans l'historique..."
              value={termeRecherche}
              onChange={gererRecherche}
              style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
            />
          )}
          <button
            onClick={gererChangementVue}
            style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', marginLeft: vueActive === 'historique' ? '20px' : '0' }}
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lieu</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Données</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Statut</th>

                </tr>
              </thead>
              <tbody>
                {donneesFiltrees.map((item) => (
                  <tr key={item.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.date}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.type}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.location}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.data}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <span className={getStatusClass(item.status)}>{item.status}</span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;