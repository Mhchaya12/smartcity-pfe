import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import Layout from '../../components/components_dash_analyste/Layout/Layout';
import Header from '../../components/components_dash_analyste/Header/Header';
import '../../styles/PerformanceReportsPage.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

const PerformanceReportsPage = () => {
  // State for reports list and active report
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  
  // UI state
  const [activeView, setActiveView] = useState('table');
  const [chartType, setChartType] = useState('bar');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    sector: '',
    period: 'month',
    metrics: [],
    sensorTypes: [], // Nouveau champ pour les types de capteurs
    selectedSensors: [], // Nouveau champ pour les capteurs sélectionnés
    isPublic: false
  });
  
  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'weekly',
    day: 'monday',
    time: '09:00',
    recipients: '',
    format: 'pdf'
  });
  
  // Sample data for demonstration
  const sampleReports = [
    { 
      id: 1, 
      title: 'Transport Efficiency Report', 
      description: 'Monthly analysis of transport system efficiency metrics',
      sector: 'Transport',
      createdAt: '2023-10-01',
      lastUpdated: '2023-10-15',
      createdBy: 'John Analyst',
      isScheduled: true,
      scheduleFrequency: 'Monthly',
      data: [
        { metric: 'On-time Performance', value: 87, status: 'normal', trend: '+3%' },
        { metric: 'Passenger Volume', value: 92, status: 'normal', trend: '+5%' },
        { metric: 'Fuel Efficiency', value: 78, status: 'normal', trend: '+2%' },
        { metric: 'Maintenance Costs', value: 65, status: 'alerte', trend: '-2%' },
        { metric: 'Customer Satisfaction', value: 82, status: 'normal', trend: '+1%' }
      ]
    },
    { 
      id: 2, 
      title: 'Energy Consumption Analysis', 
      description: 'Quarterly energy usage across city facilities',
      sector: 'Energy',
      createdAt: '2023-09-15',
      lastUpdated: '2023-10-14',
      createdBy: 'Sarah Analyst',
      isScheduled: false,
      data: [
        { metric: 'Total Consumption', value: 65, status: 'alerte', trend: '-2%' },
        { metric: 'Peak Usage', value: 72, status: 'normal', trend: '-1%' },
        { metric: 'Renewable Percentage', value: 58, status: 'alerte', trend: '+4%' },
        { metric: 'Cost Efficiency', value: 61, status: 'alerte', trend: '-3%' },
        { metric: 'Carbon Footprint', value: 55, status: 'alerte-critique', trend: '-1%' }
      ]
    },
    { 
      id: 3, 
      title: 'Waste Management Report', 
      description: 'Analysis of waste collection and recycling metrics',
      sector: 'Waste',
      createdAt: '2023-09-22',
      lastUpdated: '2023-10-13',
      createdBy: 'John Analyst',
      isScheduled: true,
      scheduleFrequency: 'Weekly',
      data: [
        { metric: 'Recycling Rate', value: 72, status: 'normal', trend: '+5%' },
        { metric: 'Collection Efficiency', value: 85, status: 'normal', trend: '+2%' },
        { metric: 'Processing Time', value: 79, status: 'normal', trend: '+3%' },
        { metric: 'Contamination Rate', value: 68, status: 'alerte', trend: '-4%' },
        { metric: 'Cost per Ton', value: 75, status: 'normal', trend: '+1%' }
      ]
    },
    { 
      id: 4, 
      title: 'Water Usage Efficiency', 
      description: 'Monthly water consumption and conservation metrics',
      sector: 'Water',
      createdAt: '2023-09-30',
      lastUpdated: '2023-10-12',
      createdBy: 'Maria Analyst',
      isScheduled: false,
      data: [
        { metric: 'Usage Efficiency', value: 58, status: 'alerte-critique', trend: '-8%' },
        { metric: 'Leakage Rate', value: 62, status: 'alerte', trend: '-5%' },
        { metric: 'Quality Compliance', value: 95, status: 'normal', trend: '+1%' },
        { metric: 'Treatment Efficiency', value: 88, status: 'normal', trend: '+3%' },
        { metric: 'Distribution Costs', value: 71, status: 'normal', trend: '-2%' }
      ]
    },
    { 
      id: 5, 
      title: 'Public Safety Metrics', 
      description: 'Quarterly public safety and emergency response analysis',
      sector: 'Public Safety',
      createdAt: '2023-09-10',
      lastUpdated: '2023-10-11',
      createdBy: 'Sarah Analyst',
      isScheduled: true,
      scheduleFrequency: 'Monthly',
      data: [
        { metric: 'Response Time', value: 92, status: 'normal', trend: '+1%' },
        { metric: 'Incident Resolution', value: 88, status: 'normal', trend: '+2%' },
        { metric: 'Public Satisfaction', value: 85, status: 'normal', trend: '+3%' },
        { metric: 'Officer Efficiency', value: 90, status: 'normal', trend: '+1%' },
        { metric: 'Cost per Incident', value: 78, status: 'normal', trend: '-2%' }
      ]
    }
  ];
  
  // Load sample data on component mount
  useEffect(() => {
    setReports(sampleReports);
    setActiveReport(sampleReports[0]);
  },[]);
  
  // Prepare chart data for active report
  const getChartData = () => {
    if (!activeReport) return null;
    
    return {
      labels: activeReport.data.map(item => item.metric),
      datasets: [
        {
          label: activeReport.title,
          data: activeReport.data.map(item => item.value),
          backgroundColor: [
            'rgba(26, 42, 68, 0.7)',
            'rgba(0, 180, 216, 0.7)',
            'rgba(144, 224, 239, 0.7)',
            'rgba(72, 202, 228, 0.7)',
            'rgba(0, 119, 182, 0.7)',
          ],
          borderColor: [
            'rgba(26, 42, 68, 1)',
            'rgba(0, 180, 216, 1)',
            'rgba(144, 224, 239, 1)',
            'rgba(72, 202, 228, 1)',
            'rgba(0, 119, 182, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: activeReport ? activeReport.title : 'Performance Metrics',
      },
    },
  };
  
  // Handle creating a new report
  const handleCreateReport = () => {
    // Simuler la génération de données pour chaque métrique sélectionnée
    const generateMetricData = (metric) => {
      return {
        metric: metric,
        value: Math.floor(Math.random() * 100),
        status: Math.random() > 0.7 ? 'alerte' : 'normal',
        trend: Math.random() > 0.5 ? '+' + Math.floor(Math.random() * 10) + '%' : '-' + Math.floor(Math.random() * 10) + '%'
      };
    };

    const newReport = {
      id: reports.length + 1,
      title: reportForm.title,
      description: reportForm.description,
      sector: reportForm.sensorTypes.join(', '),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      isScheduled: false,
      sensorTypes: reportForm.sensorTypes,
      data: reportForm.metrics.map(generateMetricData)
    };
    
    setReports([...reports, newReport]);
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
      isPublic: false
    });
  };
  
  // Handle scheduling a report
  const handleScheduleReport = () => {
    // In a real app, this would send data to an API
    const updatedReports = reports.map(report => {
      if (report.id === activeReport.id) {
        return {
          ...report,
          isScheduled: true,
          scheduleFrequency: scheduleForm.frequency
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    setActiveReport({
      ...activeReport,
      isScheduled: true,
      scheduleFrequency: scheduleForm.frequency
    });
    setShowScheduleModal(false);
  };
  
  // Handle deleting a report
  const handleDeleteReport = () => {
    // In a real app, this would send a delete request to an API
    const updatedReports = reports.filter(report => report.id !== activeReport.id);
    setReports(updatedReports);
    setActiveReport(updatedReports.length > 0 ? updatedReports[0] : null);
    setShowDeleteConfirm(false);
  };
  
  // Calculate summary statistics for active report
  const getReportSummary = () => {
    if (!activeReport || !activeReport.data.length) {
      return { average: 0, critical: 0, normal: 0, alerts: 0 };
    }
    
    const average = Math.round(
      activeReport.data.reduce((sum, item) => sum + item.value, 0) / activeReport.data.length
    );
    
    const critical = activeReport.data.filter(item => item.status === 'alerte-critique').length;
    const alerts = activeReport.data.filter(item => item.status === 'alerte').length;
    const normal = activeReport.data.filter(item => item.status === 'normal').length;
    
    return { average, critical, alerts, normal };
  };
  
  const summary = getReportSummary();

  // Ajouter ces constantes
  const SENSOR_TYPES = ['Transport', 'Sécurité','Énergie', 'Déchets'];
  const METRICS_BY_TYPE = {
    'Transport': ['Flux de véhicules', 'Temps d\'attente', 'Vitesse moyenne'],
    'Sécurité': ['Détections de mouvement', 'Incidents', 'Niveau d\'alerte'],
    'Énergie': ['Consommation', 'Efficacité', 'Pic de charge'],
    'Déchets': ['Niveau de remplissage', 'Taux de collecte', 'Taux de tri']
  };

  return (
    <Layout>
      <Header/>
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
                  <input type="text" placeholder="Search reports..." className="search-input" />
                </div>
              </div>
              
              <div className="reports-list">
                {reports.map(report => (
                  <div 
                    key={report.id} 
                    className={`report-item ${activeReport && activeReport.id === report.id ? 'active' : ''}`}
                    onClick={() => setActiveReport(report)}
                  >
                    <div className="report-item-header">
                      <h4>{report.title}</h4>
                      <span className="report-sector">{report.sector}</span>
                    </div>
                    <div className="report-item-meta">
                      <span className="report-date">Mis à jour: {report.lastUpdated}</span>
                      {report.isScheduled && (
                        <span className="report-scheduled">
                          <FaCalendarAlt /> {report.scheduleFrequency}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            
            <main className="reports-content">
              {activeReport ? (
                <>
                  <div className="report-header">
                    <div className="report-title-section">
                      <h2>{activeReport.title}</h2>
                      <p className="report-description">{activeReport.description}</p>
                      <div className="report-meta">
                        <span>Secteur: {activeReport.sector}</span>
                        <span>Créé le: {activeReport.createdAt}</span>
                        <span>Dernière mise à jour: {activeReport.lastUpdated}</span>
                        <span>Auteur: {activeReport.createdBy}</span>
                      </div>
                    </div>
                    
                    <div className="report-actions">
                      <button className="report-action-button edit" onClick={() => alert('Edit functionality would open here')}>
                        <FaEdit /> Modifier
                      </button>

                      <button className="report-action-button export">
                        <FaDownload /> Exporter
                      </button>
                      <button className="report-action-button delete" onClick={() => setShowDeleteConfirm(true)}>
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
                            {activeReport.data.map((item, index) => (
                              <tr key={index}>
                                <td>{item.metric}</td>
                                <td>{item.value}%</td>
                                <td>
                                  <span className={`status-badge ${item.status}`}>
                                    {item.status === 'normal' ? 'Normal' : 
                                    item.status === 'alerte' ? 'Alert' : 'Critical Alert'}
                                  </span>
                                </td>
                                <td className={item.trend.startsWith('+') ? 'trend-up' : 'trend-down'}>
                                  {item.trend}
                                </td>
                              </tr>
                            ))}
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
                        </div>
                        <div className="summary-card">
                          <h4>Alertes Critiques</h4>
                          <p>{summary.critical}</p>
                        </div>
                        <div className="summary-card">
                          <h4>Alertes</h4>
                          <p>{summary.alerts}</p>
                        </div>
                        <div className="summary-card">
                          <h4>Métriques Normales</h4>
                          <p>{summary.normal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-report-selected">
                  <h3>Aucun Rapport Sélectionné</h3>
                  <p>Veuillez sélectionner un rapport dans la barre latérale ou en créer un nouveau.</p>
                  <button className="create-report-button" onClick={() => setShowCreateModal(true)}>
                    <FaPlus /> Créer un Nouveau Rapport
                  </button>
                </div>
              )}
            </main>
          </div>
          
          {/* Create Report Modal */}
          {showCreateModal && (
            <div className="modal-overlay">
              <div className="modal create-report-modal">
                <div className="modal-header">
                  <h3>Créer un Nouveau Rapport de Capteurs</h3>
                  <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  {/* Champs existants */}
                  <div className="form-group">
                    <label>Titre du Rapport</label>
                    <input 
                      type="text" 
                      value={reportForm.title} 
                      onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                      placeholder="Entrez le titre du rapport"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={reportForm.description} 
                      onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                      placeholder="Entrez la description du rapport"
                    />
                  </div>

                  {/* Nouveau champ pour les types de capteurs */}
                  <div className="form-group">
                    <label>Types de Capteurs</label>
                    <div className="checkbox-group">
                      {SENSOR_TYPES.map(type => (
                        <label key={type} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={reportForm.sensorTypes.includes(type)}
                            onChange={(e) => {
                              const updatedTypes = e.target.checked
                                ? [...reportForm.sensorTypes, type]
                                : reportForm.sensorTypes.filter(t => t !== type);
                              setReportForm({
                                ...reportForm,
                                sensorTypes: updatedTypes,
                                metrics: updatedTypes.flatMap(t => METRICS_BY_TYPE[t] || [])
                              });
                            }}
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sélection des métriques */}
                  <div className="form-group">
                    <label>Métriques à Suivre</label>
                    <div className="metrics-selection">
                      {reportForm.sensorTypes.map(type => (
                        <div key={type} className="metric-group">
                          <h4>{type}</h4>
                          {METRICS_BY_TYPE[type].map(metric => (
                            <label key={metric} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={reportForm.metrics.includes(metric)}
                                onChange={(e) => {
                                  const updatedMetrics = e.target.checked
                                    ? [...reportForm.metrics, metric]
                                    : reportForm.metrics.filter(m => m !== metric);
                                  setReportForm({...reportForm, metrics: updatedMetrics});
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
                      onChange={(e) => setReportForm({...reportForm, period: e.target.value})}
                    >
                      <option value="day">Quotidien</option>
                      <option value="week">Hebdomadaire</option>
                      <option value="month">Mensuel</option>
                      <option value="quarter">Trimestriel</option>
                      <option value="year">Annuel</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={() => setShowCreateModal(false)}>Annuler</button>
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
                  <button className="close-button" onClick={() => setShowScheduleModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Fréquence</label>
                    <select 
                      value={scheduleForm.frequency} 
                      onChange={(e) => setScheduleForm({...scheduleForm, frequency: e.target.value})}
                    >
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                      <option value="quarterly">Trimestriel</option>
                    </select>
                  </div>
                  
                  {scheduleForm.frequency === 'weekly' && (
                    <div className="form-group">
                      <label>Jour de la Semaine</label>
                      <select 
                        value={scheduleForm.day} 
                        onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                      >
                        <option value="monday">Lundi</option>
                        <option value="tuesday">Mardi</option>
                        <option value="wednesday">Mercredi</option>
                        <option value="thursday">Jeudi</option>
                        <option value="friday">Vendredi</option>
                        <option value="saturday">Samedi</option>
                        <option value="sunday">Dimanche</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Heure</label>
                    <input 
                      type="time" 
                      value={scheduleForm.time} 
                      onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Destinataires (Email)</label>
                    <input 
                      type="text" 
                      value={scheduleForm.recipients} 
                      onChange={(e) => setScheduleForm({...scheduleForm, recipients: e.target.value})}
                      placeholder="Enter email addresses (comma separated)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Format</label>
                    <select 
                      value={scheduleForm.format} 
                      onChange={(e) => setScheduleForm({...scheduleForm, format: e.target.value})}
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                  <button className="schedule-button" onClick={handleScheduleReport}>Schedule Report</button>
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
                  <button className="close-button" onClick={() => setShowDeleteConfirm(false)}>×</button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete the report "{activeReport.title}"?</p>
                  <p className="warning">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button className="delete-button" onClick={handleDeleteReport}>Delete Report</button>
                </div>
              </div>
            </div>
          )}
        </div>
    </Layout>
  );
};

export default PerformanceReportsPage;



