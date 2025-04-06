import React, { useState, useRef } from 'react';
import Layout from '../../components/components_dash_analyste/Layout/Layout';
import Header from '../../components/components_dash_analyste/Header/Header';
import DataTrends from '../../components/components_dash_analyste/DataTrends/DataTrends';
import SensorAnalysis from '../../components/components_dash_analyste/SensorAnalysis/SensorAnalysis';
import WasteLevelAnalysis from '../../components/components_dash_analyste/WasteLevelAnalysis/WasteLevelAnalysis';
import '../../styles/AnalysteDashboard.css';

const initialSensorData = [
  { 
    date: '18 mars 2025, 08:15', 
    id: 'D01', 
    type: 'Déchets', 
    location: 'Rue Principale', 
    data: 'Niveau: 85%', 
    status: 'Alerte'
  },
  { 
    date: '17 mars 2025, 16:45', 
    id: 'D12', 
    type: 'Déchets', 
    location: 'Parc Central', 
    data: 'Niveau: 30%', 
    status: 'Normal'
  },
  { 
    date: '18 mars 2025, 07:00', 
    id: 'E03', 
    type: 'Énergie', 
    location: 'Mairie', 
    data: '120 kWh', 
    status: 'Normal'
  },
  { 
    date: '17 mars 2025, 14:00', 
    id: 'E07', 
    type: 'Énergie', 
    location: 'Bibliothèque', 
    data: '250 kWh', 
    status: 'Alerte'
  },
  { 
    date: '18 mars 2025, 09:00', 
    id: 'T02', 
    type: 'Transport', 
    location: 'Avenue Centrale', 
    data: '450 véhicules/h', 
    status: 'Normal'

  },
  { 
    date: '17 mars 2025, 17:30', 
    id: 'T05', 
    type: 'Transport', 
    location: 'Boulevard Ouest', 
    data: '800 véhicules/h', 
    status: 'Alerte'
  },
  { 
    date: '18 mars 2025, 03:15', 
    id: 'S01', 
    type: 'Sécurité', 
    location: 'Parking', 
    data: 'Mouvement détecté', 
    status: 'Alerte'
  },
  { 
    date: '16 mars 2025, 23:45', 
    id: 'S07', 
    type: 'Sécurité', 
    location: 'Zone Industrielle', 
    data: 'Activité inhabituelle', 
    status: 'Alerte critique'
  },
];

const AnalysteDashboard = () => {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [activeAlerts, setActiveAlerts] = useState(
    initialSensorData.filter(item => item.status !== 'Normal').map(item => ({
      id: item.id,
      titre: `${item.type} - ${item.location}`,
      ...item
    }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' ou 'analysis'
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [selectedSensorType, setSelectedSensorType] = useState('all');
  const wasteLevelsRef = useRef(null);

  // Filtrer les données en fonction des critères de recherche
  const filteredData = sensorData.filter(item =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer par type de capteur si nécessaire
  const filteredByType = selectedSensorType === 'all' 
    ? filteredData 
    : filteredData.filter(item => item.type === selectedSensorType);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleSensorTypeChange = (type) => {
    setSelectedSensorType(type);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <Header 
          title="Tableau de bord Analyste"
          subtitle="Bienvenue sur votre espace d'analyse des données urbaines"
        />
        
        <div className="dashboard-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher dans les données..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="view-toggle">
            <button 
              className={`view-button ${viewMode === 'dashboard' ? 'active' : ''}`}
              onClick={() => setViewMode('dashboard')}
            >
              Vue Analyste
            </button>
            <button 
              className={`view-button ${viewMode === 'analysis' ? 'active' : ''}`}
              onClick={() => setViewMode('analysis')}
            >
              Analyse Détaillée
            </button>
          </div>
          
          <div className="filters">
            <div className="period-filter">
              <span>Période: </span>
              <select 
                value={selectedPeriod} 
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="filter-select"
              >
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
            </div>
            
            <div className="type-filter">
              <span>Type de capteur: </span>
              <select 
                value={selectedSensorType} 
                onChange={(e) => handleSensorTypeChange(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tous</option>
                <option value="Déchets">Déchets</option>
                <option value="Énergie">Énergie</option>
                <option value="Transport">Transport</option>
                <option value="Sécurité">Sécurité</option>
              </select>
            </div>
          </div>
        </div>
        
        {viewMode === 'dashboard' ? (
          <div className="dashboard-main">
            <div className="top-row">
              <DataTrends 
                period={selectedPeriod} 
                sensorType={selectedSensorType} 
              />
            </div>
            <div className="bottom-row">
              <SensorAnalysis 
                data={filteredByType} 
                period={selectedPeriod} 
              />
              <WasteLevelAnalysis ref={wasteLevelsRef} />
            </div>
          </div>
        ) : (
          <div className="analysis-view">
            <h2>Analyse Détaillée des Capteurs</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Localisation</th>
                    <th>Données</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByType.map((item) => (
                    <tr key={item.id + item.date} className={item.status !== 'Normal' ? `status-${item.status.toLowerCase().replace(' ', '-')}` : ''}>
                      <td>{item.date}</td>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.location}</td>
                      <td>{item.data}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="data-summary">
              <h3>Résumé des Statistiques</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <h4>Total des capteurs</h4>
                  <p>{filteredByType.length}</p>
                </div>
                <div className="summary-card">
                  <h4>Alertes actives</h4>
                  <p>{filteredByType.filter(item => item.status !== 'Normal').length}</p>
                </div>
                <div className="summary-card">
                  <h4>Taux d'anomalies</h4>
                  <p>{Math.round((filteredByType.filter(item => item.status !== 'Normal').length / filteredByType.length) * 100)}%</p>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnalysteDashboard;