import React, { useRef, useState, useEffect } from 'react';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import Header from '../../components/components_dash_admin/Header/Header';
import Charts from '../../components/components_dash_admin/Charts/Charts';
import Alerts from '../../components/components_dash_admin/Alerts/Alertsad';
import Metrics from '../../components/components_dash_admin/Metrics/Metrics';
import WasteLevels from '../../components/components_dash_admin/WasteLevels/WasteLevels';
import { initialSensorHistory } from '../../data/adminData'; // Import from adminData.js
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [donneesCapteurs, setDonneesCapteurs] = useState(initialSensorHistory);
  const [historiquesActifs, setHistoriquesActifs] = useState(
    initialSensorHistory.filter(item => item.status !== 'Normal').map(item => ({
      id: item.id,
      titre: `${item.type} - ${item.location}`,
      ...item,
    }))
  );
  const [historiquesTraites, setHistoriquesTraites] = useState([]);
  const [ongletActif, setOngletActif] = useState('Actifs');
  const [termeRecherche, setTermeRecherche] = useState('');
  const [vueActive, setVueActive] = useState('dashboard'); // 'dashboard' ou 'historique'
  const wasteLevelsRef = useRef(null);

  const gererResolutionHistorique = (id) => {
    const historiqueATraiter = historiquesActifs.find((historique) => historique.id === id);
    if (historiqueATraiter) {
      setHistoriquesActifs(historiquesActifs.filter((historique) => historique.id !== id));
      setHistoriquesTraites([...historiquesTraites, { ...historiqueATraiter, traitee: true }]);
      setOngletActif('Traitées');
    }
  };

  const historiquesActifsFiltres = historiquesActifs.filter(historique =>
    historique.titre.toLowerCase().includes(termeRecherche.toLowerCase())
  );

  const historiquesTraitesFiltres = historiquesTraites.filter(historique =>
    historique.titre.toLowerCase().includes(termeRecherche.toLowerCase())
  );

  const donneesFiltrees = donneesCapteurs.filter(item =>
    item.type.toLowerCase().includes(termeRecherche.toLowerCase()) ||
    item.location.toLowerCase().includes(termeRecherche.toLowerCase()) ||
    item.data.toLowerCase().includes(termeRecherche.toLowerCase())
  );

  const gererChangementVue = () => {
    setVueActive(vueActive === 'dashboard' ? 'historique' : 'dashboard');
    setTermeRecherche(''); // Reset search term when switching views
  };

  const gererRecherche = (e) => {
    setTermeRecherche(e.target.value);
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
            <Metrics />
            <Charts />
            <div className="bottom-section">
              <Alerts />
              <div ref={wasteLevelsRef}>
                <WasteLevels />
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
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.status}</td>
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