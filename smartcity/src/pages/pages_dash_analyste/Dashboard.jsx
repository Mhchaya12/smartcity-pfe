import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../components/components_dash_analyste/Layout/Layout';
import Header from '../../components/components_dash_analyste/Header/Header';
import DataTrends from '../../components/components_dash_analyste/DataTrends/DataTrends';
import WasteLevelAnalysis from '../../components/components_dash_analyste/WasteLevelAnalysis/WasteLevelAnalysis';
import { socketService } from '../../services/socketService';
import { sensorService } from '../../services/sensorService';
import '../../styles/AnalysteDashboard.css';

// Define sensor types and options
// const SENSOR_TYPES = ['Sécurité', 'Transport', 'Énergie', 'Déchets'];
// const periodOptions = [
//   { value: 'day', label: 'Aujourd\'hui' },
//   { value: 'week', label: 'Cette semaine' },
//   { value: 'month', label: 'Ce mois' },
//   { value: 'year', label: 'Cette année' }
// ];
// const sensorTypeOptions = [
//   { value: 'all', label: 'Tous les capteurs' },
//   { value: 'Sécurité', label: 'Sécurité' },
//   { value: 'Transport', label: 'Transport' },
//   { value: 'Énergie', label: 'Énergie' },
//   { value: 'Déchets', label: 'Déchets' }
// ];

const AnalysteDashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('dashboard');

  const [selectedSensorType, setSelectedSensorType] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    totalSensors: 0,
    activeAlerts: 0,
    anomalyRate: 0,
    averageResponseTime: 0,
    lastUpdate: new Date()
  });
  const [wasteLevels, setWasteLevels] = useState([]);
  const [sensorAnalysis, setSensorAnalysis] = useState({
    security: { total: 0, active: 0, alerts: 0, history: [] },
    transport: { total: 0, active: 0, alerts: 0, history: [] },
    energy: { total: 0, active: 0, alerts: 0, history: [] },
    waste: { total: 0, active: 0, alerts: 0, history: [] }
  });
  const wasteLevelsRef = useRef(null);

  // Fetch initial sensor data
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const allSensors = await sensorService.getAllSensors();
        
        // Transform the data into the required format
        const transformedData = [
          ...allSensors.dechets.map(sensor => ({
            id: sensor._id,
            type: 'Dechet',
            location: sensor.localisation,
            data: sensor.niveaux_remplissage,
            status: sensor.status,
            lastUpdate: sensor.dernier_mise_a_jour
          })),
          ...allSensors.energie.map(sensor => ({
            id: sensor._id,
            type: 'Energie',
            location: sensor.localisation,
            data: sensor.seuilConsomation,
            status: sensor.status,
            lastUpdate: sensor.dernier_mise_a_jour
          })),
          ...allSensors.securite.map(sensor => ({
            id: sensor._id,
            type: 'Securite',
            location: sensor.localisation,
            data: sensor.anomalieDetection,
            status: sensor.status,
            lastUpdate: sensor.dernier_mise_a_jour
          })),
          ...allSensors.transport.map(sensor => ({
            id: sensor._id,
            type: 'Transport',
            location: sensor.localisation,
            data: sensor.fluxActuelle,
            status: sensor.status,
            lastUpdate: sensor.dernier_mise_a_jour
          }))
        ];

        setSensorData(transformedData);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();
  }, []);

  // Socket connection and data handling
  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleSensorUpdate = (data, type) => {
      console.log(`Received update for ${type}:`, data);
      
      let sensorValue;
      switch(type) {
        case 'SensorEnergie':
          sensorValue = data.seuilConsomation;
          break;
        case 'SensorTransport':
          sensorValue = data.fluxActuelle;
          break;
        case 'SensorDechet':
          sensorValue = data.niveaux_remplissage;
          break;
        case 'SensorSecurite':
          sensorValue = data.anomalieDetection;
          break;
        default:
          sensorValue = data.data;
      }

      const newSensorData = {
        id: data._id,
        type: type.replace('Sensor', ''),
        location: data.localisation,
        data: sensorValue,
        status: data.status,
        lastUpdate: data.dernier_mise_a_jour
      };

      setSensorData(prev => {
        const filtered = prev.filter(s => s.id !== newSensorData.id);
        return [...filtered, newSensorData];
      });

      // Update sensor analysis
      setSensorAnalysis(prev => {
        const typeKey = type.replace('Sensor', '').toLowerCase();
        const current = prev[typeKey] || { total: 0, active: 0, alerts: 0, history: [] };
        
        return {
          ...prev,
          [typeKey]: {
            total: 1,
            active: newSensorData.status === 'Normal' ? 1 : 0,
            alerts: newSensorData.status !== 'Normal' ? 1 : 0,
            history: [...current.history, { value: data.value, timestamp: new Date() }].slice(-100)
          }
        };
      });

      // Update waste levels if it's a waste sensor
      if (type === 'SensorDechet') {
        setWasteLevels(prev => {
          const filtered = prev.filter(w => w.location !== data.location);
          return [...filtered, {
            id: `${type}-${Date.now()}`,
            location: data.location,
            level: data.value
          }];
        });
      }
    };

    // Subscribe to all sensor types
    const sensorTypes = ['SensorEnergie', 'SensorTransport', 'SensorDechet', 'SensorSecurite'];
    sensorTypes.forEach(type => {
      socketService.subscribeToSensorUpdates(type, (data) => handleSensorUpdate(data, type));
    });

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Cleanup on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      sensorTypes.forEach(type => {
        socketService.unsubscribeFromSensorUpdates(type, handleSensorUpdate);
      });
    };
  }, []);

  // Update statistics every 5 seconds
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const alerts = sensorData.filter(item => item.status !== 'operational');
      
      setRealTimeStats({
        totalSensors: sensorData.length,
        activeAlerts: alerts.length,
        anomalyRate: sensorData.length > 0 
          ? Math.round((alerts.length / sensorData.length) * 100) 
          : 0,
        averageResponseTime: calculateAverageResponseTime(sensorData),
        lastUpdate: new Date()
      });

      setActiveAlerts(alerts.map(item => ({
        id: item.id,
        titre: `${item.type} - ${item.location}`,
        ...item
      })));
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [sensorData]);

  // Calculate status based on sensor type and value
  const calculateStatus = (value, type) => {
    if (!value) return 'Normal';
    
    switch (type) {
      case 'SensorSecurite':
        return value > 80 ? 'Normal' : 'Alerte';
      case 'SensorTransport':
        return value > 70 ? 'Normal' : 'Alerte';
      case 'SensorEnergie':
        return value < 80 ? 'Normal' : 'Alerte';
      case 'SensorDechet':
        return value < 85 ? 'Normal' : 'Alerte';
      default:
        return 'Normal';
    }
  };

  // Calculate average response time
  const calculateAverageResponseTime = (data) => {
    const responseTimes = data
      .filter(item => item.responseTime)
      .map(item => item.responseTime);
    
    if (responseTimes.length === 0) return 0;
    
    const sum = responseTimes.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / responseTimes.length);
  };

  // Filter data based on search and type
  const filteredData = sensorData.filter(
    (item) =>
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByType =
    selectedSensorType === 'all'
      ? filteredData
      : filteredData.filter((item) => item.type === selectedSensorType);

  return (
    <Layout>
      <div className="dashboard-container">
        <Header
          title="Tableau de bord Analyste"
          subtitle={`Bienvenue sur votre espace d'analyse des données urbaines ${!isConnected ? '(Déconnecté)' : ''}`}
        />
        

        <div className="dashboard-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par nom de capteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          <div className="type-filter">
            <span>Type de capteur: </span>
            <select
              value={selectedSensorType}
              onChange={(e) => setSelectedSensorType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les capteurs</option>
              <option value="Securite">Sécurité</option>
              <option value="Transport">Transport</option>
              <option value="Energie">Énergie</option>
              <option value="Dechet">Déchets</option>
            </select>
          </div>
        </div>

        {viewMode === 'dashboard' ? (
          <div className="dashboard-main">
            <div className="top-row">
              <DataTrends 
                sensorType={selectedSensorType}
                sensorData={sensorData}
              />
            </div>
            <div className="bottom-row">
              <WasteLevelAnalysis 
                ref={wasteLevelsRef} 
                wasteLevels={sensorData.filter(s => s.type === 'Dechet')}
              />
            </div>
          </div>
        ) : (
          <div className="analysis-view">
            <h2>Analyse Détaillée des Capteurs</h2>
            
            <div className="real-time-stats">
              <div className="stats-header">
                <h3>Statistiques en Temps Réel</h3>
                <span className="last-update">
                  Dernière mise à jour: {realTimeStats.lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total des capteurs</h4>
                  <p className="stat-value">{realTimeStats.totalSensors}</p>
                </div>
                <div className="stat-card">
                  <h4>Alertes actives</h4>
                  <p className="stat-value">{realTimeStats.activeAlerts}</p>
                </div>
                <div className="stat-card">
                  <h4>Taux d'anomalies</h4>
                  <p className="stat-value">{realTimeStats.anomalyRate}%</p>
                </div>
                <div className="stat-card">
                  <h4>Temps de réponse moyen</h4>
                  <p className="stat-value">{realTimeStats.averageResponseTime}ms</p>
                </div>
              </div>
            </div>

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
                    <th>Dernière mise à jour</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByType.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        item.status !== 'operational'
                          ? `status-${item.status.toLowerCase()}`
                          : ''
                      }
                    >
                      <td>{new Date(item.lastUpdate).toLocaleDateString()}</td>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.location}</td>
                      <td>{item.data}</td>
                      <td>
                        <span
                          className={`status-badge ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>{new Date(item.lastUpdate).toLocaleTimeString()}</td>
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

export default AnalysteDashboard;