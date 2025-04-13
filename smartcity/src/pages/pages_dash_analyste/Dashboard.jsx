import React, { useState, useRef } from 'react';
import Layout from '../../components/components_dash_analyste/Layout/Layout';
import Header from '../../components/components_dash_analyste/Header/Header';
import DataTrends from '../../components/components_dash_analyste/DataTrends/DataTrends';
import SensorAnalysis from '../../components/components_dash_analyste/SensorAnalysis/SensorAnalysis';
import WasteLevelAnalysis from '../../components/components_dash_analyste/WasteLevelAnalysis/WasteLevelAnalysis';
import { initialSensorData, periodOptions, sensorTypeOptions } from '../../data/analysteData';
import '../../styles/AnalysteDashboard.css';

const AnalysteDashboard = () => {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [activeAlerts, setActiveAlerts] = useState(
    initialSensorData
      .filter((item) => item.status !== 'Normal')
      .map((item) => ({
        id: item.id,
        titre: `${item.type} - ${item.location}`,
        ...item,
      }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' ou 'analysis'
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [selectedSensorType, setSelectedSensorType] = useState('all');
  const wasteLevelsRef = useRef(null);

  // Filtrer les données en fonction des critères de recherche
  const filteredData = sensorData.filter(
    (item) =>
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.data.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer par type de capteur si nécessaire
  const filteredByType =
    selectedSensorType === 'all'
      ? filteredData
      : filteredData.filter((item) => item.type === selectedSensorType);

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
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="type-filter">
              <span>Type de capteur: </span>
              <select
                value={selectedSensorType}
                onChange={(e) => handleSensorTypeChange(e.target.value)}
                className="filter-select"
              >
                {sensorTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {viewMode === 'dashboard' ? (
          <div className="dashboard-main">
            <div className="top-row">
              <DataTrends period={selectedPeriod} sensorType={selectedSensorType} />
            </div>
            <div className="bottom-row">
              <SensorAnalysis data={filteredByType} period={selectedPeriod} />
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
                    <tr
                      key={item.id + item.date}
                      className={
                        item.status !== 'Normal'
                          ? `status-${item.status.toLowerCase().replace(' ', '-')}`
                          : ''
                      }
                    >
                      <td>{item.date}</td>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.location}</td>
                      <td>{item.data}</td>
                      <td>
                        <span
                          className={`status-badge ${item.status
                            .toLowerCase()
                            .replace(' ', '-')}`}
                        >
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
                  <p>{filteredByType.filter((item) => item.status !== 'Normal').length}</p>
                </div>
                <div className="summary-card">
                  <h4>Taux d'anomalies</h4>
                  <p>
                    {filteredByType.length > 0
                      ? Math.round(
                          (filteredByType.filter((item) => item.status !== 'Normal').length /
                            filteredByType.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
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