import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import Layout from '../../components/components_dash_analyste/Layout/Layout';
import Header from '../../components/components_dash_analyste/Header/Header';
import { socketService } from '../../services/socketService';
import {
  performanceChartColors,
  getPerformanceChartOptions,
  SENSOR_TYPES,
  METRICS_BY_TYPE,
  reportPeriodOptions,
  scheduleFrequencyOptions,
  scheduleDayOptions,
  exportFormatOptions,
} from '../../data/analysteData';
import * as reportService from '../../services/reportService';
import '../../styles/PerformanceReportsPage.css';

const PerformanceReportsPage = ({ energie, dechets, transport, securite }) => {
  // State for reports list and active report
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [activeView, setActiveView] = useState('table');
  const [chartType, setChartType] = useState('bar');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    sector: '',
    period: 'month',
    metrics: [],
    sensorTypes: [],
    selectedSensors: [],
    isPublic: false,
    sensorData: []
  });

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'weekly',
    day: 'monday',
    time: '09:00',
    recipients: '',
    format: 'pdf',
  });

  // State for real-time sensor data
  const [sensorData, setSensorData] = useState({
    securite: [],
    transport: [],
    energie: [],
    dechet: []
  });

  // Ajouter un nouvel état pour les données en temps réel
  const [realTimeData, setRealTimeData] = useState({
    securite: [],
    transport: [],
    energie: [],
    dechet: []
  });

  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    period: '',
    sensorTypes: [],
    metrics: [],
    sensorData: []
  });

  // Load reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await reportService.getAllReports();
        const reportsData = Array.isArray(response) ? response : [];
        setReports(reportsData);
        if (reportsData.length > 0) {
          setActiveReport(reportsData[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Erreur lors du chargement des rapports');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Update sensor data when props change
  useEffect(() => {
    const updateSensorData = () => {
      const newData = {
        securite: securite ? [{
          id: 'securite-1',
          value: securite.value || 0,
          location: securite.location || 'Non spécifié',
          timestamp: new Date().toISOString()
        }] : [],
        transport: transport ? [{
          id: 'transport-1',
          value: transport.value || 0,
          location: transport.location || 'Non spécifié',
          timestamp: new Date().toISOString()
        }] : [],
        energie: energie ? [{
          id: 'energie-1',
          value: energie.value || 0,
          location: energie.location || 'Non spécifié',
          timestamp: new Date().toISOString()
        }] : [],
        dechet: dechets ? [{
          id: 'dechets-1',
          value: dechets.value || 0,
          location: dechets.location || 'Non spécifié',
          timestamp: new Date().toISOString()
        }] : []
      };
      setSensorData(newData);
    };

    updateSensorData();
  }, [securite, transport, energie, dechets]);

  // Ajouter useEffect pour la connexion socket
  useEffect(() => {
    // Connexion au socket
    const socket = socketService.connect();

    // S'abonner aux mises à jour des capteurs
    const handleSecuriteUpdate = (data) => {
      if (reportForm.sensorTypes.includes('Sécurité')) {
        setReportForm(prev => ({
          ...prev,
          sensorData: [...prev.sensorData, {
            type: 'Sécurité',
            value: data.value || Math.floor(Math.random() * 100),
            location: data.location || 'Zone A',
            timestamp: new Date().toISOString(),
            metrics: {
              'Taux de Détection': data.value || Math.floor(Math.random() * 100),
              'Temps de Réponse': Math.floor(Math.random() * 30)
            }
          }]
        }));
      }
    };

    const handleTransportUpdate = (data) => {
      if (reportForm.sensorTypes.includes('Transport')) {
        setReportForm(prev => ({
          ...prev,
          sensorData: [...prev.sensorData, {
            type: 'Transport',
            value: data.value || Math.floor(Math.random() * 100),
            location: data.location || 'Rue Principale',
            timestamp: new Date().toISOString(),
            metrics: {
              'Fluidité du Trafic': data.value || Math.floor(Math.random() * 100),
              'Occupation Parking': Math.floor(Math.random() * 100)
            }
          }]
        }));
      }
    };

    const handleEnergieUpdate = (data) => {
      if (reportForm.sensorTypes.includes('Énergie')) {
        setReportForm(prev => ({
          ...prev,
          sensorData: [...prev.sensorData, {
            type: 'Énergie',
            value: data.value || Math.floor(Math.random() * 100),
            location: data.location || 'Bâtiment Central',
            timestamp: new Date().toISOString(),
            metrics: {
              'Consommation': data.value || Math.floor(Math.random() * 100),
              'Production': Math.floor(Math.random() * 100)
            }
          }]
        }));
      }
    };

    const handleDechetUpdate = (data) => {
      if (reportForm.sensorTypes.includes('Déchets')) {
        setReportForm(prev => ({
          ...prev,
          sensorData: [...prev.sensorData, {
            type: 'Déchets',
            value: data.value || Math.floor(Math.random() * 100),
            location: data.location || 'Zone de Collecte',
            timestamp: new Date().toISOString(),
            metrics: {
              'Niveau de Remplissage': data.value || Math.floor(Math.random() * 100),
              'Taux de Recyclage': Math.floor(Math.random() * 100)
            }
          }]
        }));
      }
    };

    // S'abonner aux événements
    socketService.subscribeToSensorUpdates('Securite', handleSecuriteUpdate);
    socketService.subscribeToSensorUpdates('Transport', handleTransportUpdate);
    socketService.subscribeToSensorUpdates('Energie', handleEnergieUpdate);
    socketService.subscribeToSensorUpdates('Dechet', handleDechetUpdate);

    // Nettoyage lors du démontage du composant
    return () => {
      socketService.unsubscribeFromSensorUpdates('Securite', handleSecuriteUpdate);
      socketService.unsubscribeFromSensorUpdates('Transport', handleTransportUpdate);
      socketService.unsubscribeFromSensorUpdates('Energie', handleEnergieUpdate);
      socketService.unsubscribeFromSensorUpdates('Dechet', handleDechetUpdate);
      socketService.disconnect();
    };
  }, [reportForm.sensorTypes]);

  // Modifier la fonction getReportSummary pour calculer les statistiques réelles
  const getReportSummary = () => {
    if (!activeReport) {
      return { average: 0, critical: 0, normal: 0, alerts: 0 };
    }

    const data = activeReport.data || [];
    if (data.length === 0) {
      return { average: 0, critical: 0, normal: 0, alerts: 0 };
    }

    const values = data.map(item => Number(item.value));
    const average = values.reduce((acc, val) => acc + val, 0) / values.length;
    
    const statusCounts = data.reduce((acc, item) => {
      if (item.status === 'normal') acc.normal++;
      else if (item.status === 'alerte') acc.alerts++;
      else if (item.status === 'alerte-critique') acc.critical++;
      return acc;
    }, { normal: 0, alerts: 0, critical: 0 });

    return {
      average: Math.round(average),
      critical: statusCounts.critical,
      alerts: statusCounts.alerts,
      normal: statusCounts.normal
    };
  };

  // Modifier la fonction getChartData pour utiliser les données du socket
  const getChartData = () => {
    if (!activeReport) return null;

    const data = activeReport.data || [];
    if (data.length === 0) {
      return {
        labels: ['En attente de données...'],
        datasets: [{
          label: activeReport.titre_rapport || 'Untitled Report',
          data: [],
          backgroundColor: performanceChartColors.backgroundColor,
          borderColor: performanceChartColors.borderColor,
          borderWidth: 1,
        }],
      };
    }

    // Grouper les données par type de capteur
    const groupedData = data.reduce((acc, item) => {
      const type = item.metric.split(' - ')[0];
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        value: Number(item.value),
        timestamp: new Date(item.timestamp),
        location: item.location
      });
      return acc;
    }, {});

    // Créer les datasets pour chaque type de capteur
    const datasets = Object.entries(groupedData).map(([type, values], index) => ({
      label: type,
      data: values.map(v => v.value),
      backgroundColor: performanceChartColors.backgroundColor[index % performanceChartColors.backgroundColor.length],
      borderColor: performanceChartColors.borderColor[index % performanceChartColors.borderColor.length],
      borderWidth: 1,
    }));

    // Créer les labels basés sur les timestamps
    const labels = Object.values(groupedData)[0]?.map(v => 
      new Date(v.timestamp).toLocaleTimeString()
    ) || [];

    return {
      labels,
      datasets
    };
  };

  // Modifier les options du graphique pour une meilleure visualisation
  const chartOptions = {
    ...getPerformanceChartOptions(activeReport?.title),
    animation: {
      duration: 0
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Valeur (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Heure'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const dataIndex = context.dataIndex;
            const location = Object.values(groupedData)[0][dataIndex]?.location;
            return `${label}: ${value}% (${location})`;
          }
        }
      }
    }
  };

  // Modifier handleCreateReport pour inclure les données du socket
  const handleCreateReport = async () => {
    try {
      // Formater les données des capteurs pour correspondre au schéma attendu
      const formattedData = reportForm.sensorData.map(data => {
        const metrics = Object.entries(data.metrics).map(([metric, value]) => ({
          metric: `${data.type} - ${metric}`,
          value: Number(value),
          status: Number(value) > 80 ? 'normal' : 'alerte',
          trend: '+0%',
          location: data.location,
          timestamp: data.timestamp
        }));
        return metrics;
      }).flat();

      const reportData = {
        type: reportForm.sensorTypes.join(', '),
        type_rapport: reportForm.period,
        titre_rapport: reportForm.title,
        description: reportForm.description,
        data: formattedData
      };

      console.log('Sending report data:', reportData);

      const newReport = await reportService.createReport(reportData);
      setReports(prev => [...prev, newReport]);
      setActiveReport(newReport);
      setShowCreateModal(false);
      setReportForm({
        title: '',
        description: '',
        sector: '',
        period: 'month',
        metrics: [],
        sensorTypes: [],
        selectedSensors: [],
        isPublic: false,
        sensorData: []
      });
    } catch (error) {
      console.error('Error creating report:', error);
      setError('Failed to create report. Please try again.');
    }
  };

  // Handle scheduling a report
  const handleScheduleReport = () => {
    const updatedReports = reports.map((report) => {
      if (report.id === activeReport.id) {
        return {
          ...report,
          isScheduled: true,
          scheduleFrequency: scheduleForm.frequency,
        };
      }
      return report;
    });

    setReports(updatedReports);
    setActiveReport({
      ...activeReport,
      isScheduled: true,
      scheduleFrequency: scheduleForm.frequency,
    });
    setShowScheduleModal(false);
  };

  // Handle deleting a report
  const handleDeleteReport = async () => {
    try {
      await reportService.deleteReport(activeReport._id);
      const updatedReports = reports.filter(report => report._id !== activeReport._id);
      setReports(updatedReports);
      setActiveReport(updatedReports.length > 0 ? updatedReports[0] : null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  // Fonction pour ouvrir le modal de modification
  const handleEditClick = (report) => {
    setEditForm({
      title: report.titre_rapport || '',
      description: report.description || '',
      period: report.type_rapport || 'month',
      sensorTypes: report.type ? report.type.split(', ') : [],
      metrics: report.data ? report.data.map(item => item.metric) : [],
      sensorData: report.data || []
    });
    setShowEditModal(true);
  };

  // Fonction pour gérer la modification du rapport
  const handleEditReport = async () => {
    try {
      const updatedData = {
        type: editForm.sensorTypes.join(', '),
        type_rapport: editForm.period,
        titre_rapport: editForm.title,
        description: editForm.description,
        data: editForm.sensorData
      };

      const updatedReport = await reportService.updateReport(activeReport._id, updatedData);
      
      setReports(prev => prev.map(report => 
        report._id === activeReport._id ? updatedReport : report
      ));
      setActiveReport(updatedReport);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating report:', error);
      setError('Failed to update report. Please try again.');
    }
  };

  // Fonction de filtrage des rapports par nom
  const filteredReports = reports.filter(report => 
    report.titre_rapport?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const summary = getReportSummary();

  return (
    <Layout>
      <Header
          title="Tableau de bord Analyste"
          subtitle="Bienvenue sur votre espace d'analyse des données urbaines"
      />
      <div className="performance-reports-page">
        <header className="reports-header">
          <h1>Rapports de Performance</h1>
          <div className="header-actions">
            <button className="create-report-button" onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Créer un Nouveau Rapport
            </button>
          </div>
        </header>

        <div className="reports-container">
          <aside className="reports-sidebar">
            <div className="sidebar-header">
              <h3>Mes Rapports</h3>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Rechercher un rapport par nom..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="reports-list">
              {loading ? (
                <div className="loading">Chargement des rapports...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : filteredReports.length === 0 ? (
                <div className="no-reports">Aucun rapport trouvé</div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report._id || Math.random()}
                    className={`report-item ${activeReport && activeReport._id === report._id ? 'active' : ''}`}
                    onClick={() => setActiveReport(report)}
                  >
                    <div className="report-item-header">
                      <h4>{report.titre_rapport || 'Sans titre'}</h4>
                      <span className="report-sector">{report.type || 'Non spécifié'}</span>
                    </div>
                    <div className="report-item-meta">
                      <span className="report-date">
                        Mis à jour: {report.dateGeneration ? new Date(report.dateGeneration).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <main className="reports-content">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : !activeReport ? (
              <div className="no-report-selected">
                <h3>Aucun Rapport Sélectionné</h3>
                <p>Veuillez sélectionner un rapport dans la barre latérale ou en créer un nouveau.</p>
                <button className="create-report-button" onClick={() => setShowCreateModal(true)}>
                  <FaPlus /> Créer un Nouveau Rapport
                </button>
              </div>
            ) : (
              <>
                <div className="report-header">
                  <div className="report-title-section">
                    <h2>{activeReport.titre_rapport || 'Sans titre'}</h2>
                    <p className="report-description">{activeReport.description || 'Aucune description'}</p>
                    <div className="report-meta">
                      <span>Secteur: {activeReport.type || 'Non spécifié'}</span>
                      <span>Type: {activeReport.type_rapport || 'Non spécifié'}</span>
                      <span>Date: {activeReport.dateGeneration ? new Date(activeReport.dateGeneration).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="report-actions">
                    <button
                      className="report-action-button edit"
                      onClick={() => handleEditClick(activeReport)}
                    >
                      <FaEdit /> Modifier
                    </button>
                    <button
                      className="report-action-button delete"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>

                <div className="report-view-toggle">
                  <button
                    className={`view-button ${activeView === 'table' ? 'active' : ''}`}
                    onClick={() => setActiveView('table')}
                  >
                    Vue Tableau
                  </button>
                  <button
                    className={`view-button ${activeView === 'chart' ? 'active' : ''}`}
                    onClick={() => setActiveView('chart')}
                  >
                    Vue Graphique
                  </button>
                </div>

                <div className="report-content">
                  {activeView === 'table' ? (
                    <div className="report-table-view">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Métrique</th>
                            <th>Valeur</th>
                            <th>Statut</th>
                            <th>Tendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeReport?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.metric}</td>
                              <td>{item.value}%</td>
                              <td>
                                <span className={`status-badge ${item.status}`}>
                                  {item.status === 'normal'
                                    ? 'Normal'
                                    : item.status === 'alerte'
                                    ? 'Alert'
                                    : 'Critical Alert'}
                                </span>
                              </td>
                              <td className={item.trend.startsWith('+') ? 'trend-up' : 'trend-down'}>
                                {item.trend}
                              </td>
                            </tr>
                          )) || (
                            <tr>
                              <td colSpan="4" className="no-data-message">
                                No data available for this report
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="report-chart-view">
                      <div className="chart-controls">
                        <div className="chart-type-toggle">
                          <button
                            className={`chart-type-button ${chartType === 'bar' ? 'active' : ''}`}
                            onClick={() => setChartType('bar')}
                          >
                            Barres
                          </button>
                          <button
                            className={`chart-type-button ${chartType === 'line' ? 'active' : ''}`}
                            onClick={() => setChartType('line')}
                          >
                            Lignes
                          </button>
                          <button
                            className={`chart-type-button ${chartType === 'pie' ? 'active' : ''}`}
                            onClick={() => setChartType('pie')}
                          >
                            Circulaire
                          </button>
                        </div>
                      </div>

                      <div className="chart-container">
                        {chartType === 'bar' && <Bar data={getChartData()} options={chartOptions} />}
                        {chartType === 'line' && <Line data={getChartData()} options={chartOptions} />}
                        {chartType === 'pie' && <Pie data={getChartData()} options={chartOptions} />}
                      </div>
                    </div>
                  )}

                  <div className="report-summary">
                    <h3>Résumé du Rapport</h3>
                    <div className="summary-cards">
                      <div className="summary-card">
                        <h4>Performance Moyenne</h4>
                        <p>{summary.average}%</p>
                        <div className="summary-trend">
                          {summary.average > 80 ? '↑' : summary.average < 60 ? '↓' : '→'}
                        </div>
                      </div>
                      <div className="summary-card">
                        <h4>Alertes Critiques</h4>
                        <p>{summary.critical}</p>
                        <div className="summary-trend critical">
                          {summary.critical > 0 ? '⚠️' : '✓'}
                        </div>
                      </div>
                      <div className="summary-card">
                        <h4>Alertes</h4>
                        <p>{summary.alerts}</p>
                        <div className="summary-trend warning">
                          {summary.alerts > 0 ? '⚠️' : '✓'}
                        </div>
                      </div>
                      <div className="summary-card">
                        <h4>Métriques Normales</h4>
                        <p>{summary.normal}</p>
                        <div className="summary-trend success">
                          {summary.normal > 0 ? '✓' : '⚠️'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Create Report Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal create-report-modal">
              <div className="modal-header">
                <h3>Créer un Nouveau Rapport</h3>
                <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre du Rapport</label>
                  <input
                    type="text"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    placeholder="Entrez le titre du rapport"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    placeholder="Entrez la description du rapport"
                  />
                </div>

                <div className="form-group">
                  <label>Types de Capteurs</label>
                  <div className="checkbox-group">
                    {SENSOR_TYPES.map((type) => (
                      <label key={type} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={reportForm.sensorTypes.includes(type)}
                          onChange={(e) => {
                            const updatedTypes = e.target.checked
                              ? [...reportForm.sensorTypes, type]
                              : reportForm.sensorTypes.filter((t) => t !== type);
                            setReportForm({
                              ...reportForm,
                              sensorTypes: updatedTypes,
                              metrics: updatedTypes.flatMap((t) => METRICS_BY_TYPE[t] || []),
                            });
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Métriques à Suivre</label>
                  <div className="metrics-selection">
                    {reportForm.sensorTypes.map((type) => (
                      <div key={type} className="metric-group">
                        <h4>{type}</h4>
                        {METRICS_BY_TYPE[type].map((metric) => (
                          <label key={metric} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={reportForm.metrics.includes(metric)}
                              onChange={(e) => {
                                const updatedMetrics = e.target.checked
                                  ? [...reportForm.metrics, metric]
                                  : reportForm.metrics.filter((m) => m !== metric);
                                setReportForm({ ...reportForm, metrics: updatedMetrics });
                              }}
                            />
                            {metric}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Période de Rapport</label>
                  <select
                    value={reportForm.period}
                    onChange={(e) => setReportForm({ ...reportForm, period: e.target.value })}
                  >
                    {reportPeriodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Données des Capteurs</label>
                  <div className="data-list">
                    {reportForm.sensorData.map((data, index) => (
                      <div key={index} className="data-item">
                        <div className="data-header">
                          <span className="data-type">{data.type}</span>
                          <span className="data-location">{data.location}</span>
                          <span className="data-time">
                            {new Date(data.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="data-metrics">
                          {Object.entries(data.metrics).map(([metric, value]) => (
                            <div key={metric} className="metric-item">
                              <span className="metric-name">{metric}</span>
                              <span className="metric-value">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {reportForm.sensorData.length === 0 && (
                      <div className="no-data-message">
                        En attente de données des capteurs...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-button" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </button>
                <button
                  className="create-button"
                  onClick={handleCreateReport}
                  disabled={!reportForm.title || reportForm.metrics.length === 0}
                >
                  Créer le Rapport
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Report Modal */}
        {showScheduleModal && (
          <div className="modal-overlay">
            <div className="modal schedule-modal">
              <div className="modal-header">
                <h3>Planifier le Rapport: {activeReport.title}</h3>
                <button className="close-button" onClick={() => setShowScheduleModal(false)}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Fréquence</label>
                  <select
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  >
                    {scheduleFrequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {scheduleForm.frequency === 'weekly' && (
                  <div className="form-group">
                    <label>Jour de la Semaine</label>
                    <select
                      value={scheduleForm.day}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                    >
                      {scheduleDayOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Heure</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Destinataires (Email)</label>
                  <input
                    type="text"
                    value={scheduleForm.recipients}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, recipients: e.target.value })}
                    placeholder="Enter email addresses (comma separated)"
                  />
                </div>

                <div className="form-group">
                  <label>Format</label>
                  <select
                    value={scheduleForm.format}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, format: e.target.value })}
                  >
                    {exportFormatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-button" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button className="schedule-button" onClick={handleScheduleReport}>
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal delete-confirm-modal">
              <div className="modal-header">
                <h3>Supprimer le Rapport</h3>
                <button className="close-button" onClick={() => setShowDeleteConfirm(false)}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>
                Êtes-vous sûr de vouloir supprimer le rapport{activeReport.title}?</p>
                {/* <p className="warning">Cette action ne peut pas être annulée.</p> */}
              </div>
              <div className="modal-footer">
                <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </button>
                <button className="delete-button" onClick={handleDeleteReport}>
                  Supprimer le Rapport
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Report Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal edit-report-modal">
              <div className="modal-header">
                <h3>Modifier le Rapport</h3>
                <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre du Rapport</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Entrez le titre du rapport"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Entrez la description du rapport"
                  />
                </div>

                <div className="form-group">
                  <label>Types de Capteurs</label>
                  <div className="checkbox-group">
                    {SENSOR_TYPES.map((type) => (
                      <label key={type} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editForm.sensorTypes.includes(type)}
                          onChange={(e) => {
                            const updatedTypes = e.target.checked
                              ? [...editForm.sensorTypes, type]
                              : editForm.sensorTypes.filter((t) => t !== type);
                            setEditForm({
                              ...editForm,
                              sensorTypes: updatedTypes,
                              metrics: updatedTypes.flatMap((t) => METRICS_BY_TYPE[t] || [])
                            });
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Période de Rapport</label>
                  <select
                    value={editForm.period}
                    onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                  >
                    {reportPeriodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Données des Capteurs</label>
                  <div className="data-list">
                    {editForm.sensorData.map((data, index) => (
                      <div key={index} className="data-item">
                        <div className="data-header">
                          <span className="data-type">{data.metric}</span>
                          <span className="data-location">{data.location}</span>
                          <span className="data-time">
                            {new Date(data.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="data-metrics">
                          <div className="metric-item">
                            <span className="metric-name">Valeur</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={data.value}
                              onChange={(e) => {
                                const newData = [...editForm.sensorData];
                                newData[index] = {
                                  ...data,
                                  value: Number(e.target.value),
                                  status: Number(e.target.value) > 80 ? 'normal' : 'alerte'
                                };
                                setEditForm({ ...editForm, sensorData: newData });
                              }}
                              className="metric-value-input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-button" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button
                  className="edit-button"
                  onClick={handleEditReport}
                  disabled={!editForm.title || editForm.sensorData.length === 0}
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PerformanceReportsPage;