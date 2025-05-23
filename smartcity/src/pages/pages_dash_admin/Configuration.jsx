import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { TextField, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import Header from '../../components/components_dash_admin/Header/Header';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import '../../styles/Configuration.css';

const API_BASE_URL = 'http://localhost:5050';

const Configuration = () => {
  const [energyThreshold, setEnergyThreshold] = useState(500);
  const [peakStart, setPeakStart] = useState('08:00');
  const [peakEnd, setPeakEnd] = useState('18:00');
  const [peakMorning, setPeakMorning] = useState('08:00');
  const [peakEvening, setPeakEvening] = useState('17:00');
  const [trafficInterval, setTrafficInterval] = useState(30);
  const [wasteThreshold, setWasteThreshold] = useState(75);
  const [wasteFrequency, setWasteFrequency] = useState('QUOTIDIENNE');
  const [wasteTime, setWasteTime] = useState('06:00');
  const [securityIncidentThreshold, setSecurityIncidentThreshold] = useState(5);
  const [securityCheckFrequency, setSecurityCheckFrequency] = useState('15');
  const [securityCriticalLevel, setSecurityCriticalLevel] = useState('2');

  // État pour l'historique et l'affichage
  const [history, setHistory] = useState([]);
  const [vueActive, setVueActive] = useState('config'); // 'config' ou 'historique'
  const [termeRecherche, setTermeRecherche] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch configurations history on component mount
  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching configurations...');
      
      const response = await fetch(`${API_BASE_URL}/api/configuration/historique`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des configurations');
      }

      console.log('Received configurations:', data);
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching configurations:', error);
      setError(error.message || 'Erreur lors du chargement de l\'historique');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation des données avant envoi
      if (!energyThreshold || !peakStart || !peakEnd || !peakMorning || !peakEvening || 
          !trafficInterval || !wasteThreshold || !wasteFrequency || !wasteTime || 
          !securityIncidentThreshold || !securityCheckFrequency || !securityCriticalLevel) {
        console.log('Missing fields:', {
          energyThreshold,
          peakStart,
          peakEnd,
          peakMorning,
          peakEvening,
          trafficInterval,
          wasteThreshold,
          wasteFrequency,
          wasteTime,
          securityIncidentThreshold,
          securityCheckFrequency,
          securityCriticalLevel
        });
        throw new Error('Tous les champs sont requis');
      }

      const newConfig = {
        date: new Date(),
        seuil_energie: Number(energyThreshold),
        debut_pointe: peakStart,
        fin_pointe: peakEnd,
        matin_pointe: peakMorning,
        soir_pointe: peakEvening,
        intervalle_trafic: Number(trafficInterval),
        seuil_dechet: Number(wasteThreshold),
        frequence_deche: wasteFrequency,
        temps_collect_dechet: wasteTime,
        seuil_securite: Number(securityIncidentThreshold),
        frequence_controle_securite: securityCheckFrequency,
        niveau_critique_securite: securityCriticalLevel
      };

      console.log('Sending configuration:', newConfig);

      const response = await fetch(`${API_BASE_URL}/api/configuration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.message || 'Erreur lors de la sauvegarde';
        if (data.missingFields) {
          errorMessage += `\nChamps manquants: ${data.missingFields.join(', ')}`;
        }
        if (data.invalidFields) {
          errorMessage += `\nChamps invalides: ${data.invalidFields.join(', ')}`;
        }
        if (data.details) {
          errorMessage += `\nDétails: ${JSON.stringify(data.details)}`;
        }
        throw new Error(errorMessage);
      }

      setHistory(prevHistory => [data, ...prevHistory]);
      alert('Configuration sauvegardée avec succès!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      setError(error.message || 'Erreur lors de la sauvegarde de la configuration');
      alert(error.message || 'Erreur lors de la sauvegarde de la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const gererChangementVue = () => {
    setVueActive(vueActive === 'config' ? 'historique' : 'config');
    setTermeRecherche(''); // Réinitialiser la recherche lors du changement de vue
  };

  const gererRecherche = (e) => {
    setTermeRecherche(e.target.value);
  };

  const historiqueFiltree = Array.isArray(history) ? history.filter(item =>
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(termeRecherche.toLowerCase())
    )
  ) : [];

  return (
    <Layout>
      <Header title="Configuration des seuils" />
      <div className="settings-container">
        <h1>Configuration des Seuils</h1>
        
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        <div className="controls">
          {vueActive === 'historique' && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={termeRecherche}
                onChange={gererRecherche}
              />
            </div>
          )}
          <button onClick={gererChangementVue}>
            {vueActive === 'config' ? "Voir l'historique" : 'Retour à la configuration'}
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Chargement...</div>
        ) : (
          vueActive === 'config' ? (
            <>
              <p>Définir les seuils d'alerte des systèmes urbains</p>

              <div className="settings-grid">
                {/* Energy Consumption Section */}
                <div className="settings-card">
                  <h3>Consommation d'Énergie</h3>
                  <p>Les seuils et alertes liés à l'énergie</p>
                  <div className="form-group">
                    <label>Seuil d'alerte (kWh)</label>
                    <Slider
                      min={0}
                      max={1000}
                      value={energyThreshold}
                      onChange={(value) => setEnergyThreshold(value)}
                    />
                    <span>{energyThreshold} kWh</span>
                  </div>
                  <div className="form-group time-row naturals">
                    <div>
                      <label>Heures de pointe (début)</label>
                      <TextField
                        type="time"
                        value={peakStart}
                        onChange={(e) => setPeakStart(e.target.value)}
                        variant="outlined"
                        size="small"
                        className="time-picker"
                      />
                    </div>
                    <div>
                      <label>Heures de pointe (fin)</label>
                      <TextField
                        type="time"
                        value={peakEnd}
                        onChange={(e) => setPeakEnd(e.target.value)}
                        variant="outlined"
                        size="small"
                        className="time-picker"
                      />
                    </div>
                  </div>
                </div>

                {/* Traffic Lights Section */}
                <div className="settings-card">
                  <h3>Feux de Circulation</h3>
                  <p>Configurer l'optimisation des feux de circulation</p>
                  <div className="form-group">
                    <label>Intervalle d'ajustement (secondes)</label>
                    <Slider
                      min={0}
                      max={60}
                      value={trafficInterval}
                      onChange={(value) => setTrafficInterval(value)}
                    />
                    <span>{trafficInterval} sec</span>
                  </div>
                  <div className="form-group time-row">
                    <div>
                      <label>Heure de pointe (matin)</label>
                      <TextField
                        type="time"
                        value={peakMorning}
                        onChange={(e) => setPeakMorning(e.target.value)}
                        variant="outlined"
                        size="small"
                        className="time-picker"
                      />
                    </div>
                    <div>
                      <label>Heure de pointe (soir)</label>
                      <TextField
                        type="time"
                        value={peakEvening}
                        onChange={(e) => setPeakEvening(e.target.value)}
                        variant="outlined"
                        size="small"
                        className="time-picker"
                      />
                    </div>
                  </div>
                </div>

                {/* Waste Management Section */}
                <div className="settings-card">
                  <h3>Gestion des Déchets</h3>
                  <p>Configurer les seuils et la collecte des déchets</p>
                  <div className="form-group">
                    <label>Seuil de remplissage (%)</label>
                    <Slider
                      min={0}
                      max={100}
                      value={wasteThreshold}
                      onChange={(value) => setWasteThreshold(value)}
                    />
                    <span>{wasteThreshold}%</span>
                  </div>
                  <div className="form-group select-row">
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Fréquence de collecte</InputLabel>
                        <Select
                          value={wasteFrequency}
                          onChange={(e) => setWasteFrequency(e.target.value)}
                          label="Fréquence de collecte"
                        >
                          <MenuItem value="QUOTIDIENNE">Quotidienne</MenuItem>
                          <MenuItem value="HEBDOMADAIRE">Hebdomadaire</MenuItem>
                          <MenuItem value="MENSUELLE">Mensuelle</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <label>Heure de collecte</label>
                      <TextField
                        type="time"
                        value={wasteTime}
                        onChange={(e) => setWasteTime(e.target.value)}
                        variant="outlined"
                        size="small"
                        className="time-picker"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="settings-card">
                  <h3>Sécurité</h3>
                  <p>Configurer les seuils et alertes de sécurité</p>
                  <div className="form-group">
                    <label>Seuil d'incidents (nombre)</label>
                    <Slider
                      min={0}
                      max={20}
                      value={securityIncidentThreshold}
                      onChange={(value) => setSecurityIncidentThreshold(value)}
                    />
                    <span>{securityIncidentThreshold} incidents</span>
                  </div>
                  <div className="form-group select-row">
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Fréquence de vérification</InputLabel>
                        <Select
                          value={securityCheckFrequency}
                          onChange={(e) => setSecurityCheckFrequency(e.target.value)}
                          label="Fréquence de vérification"
                        >
                          <MenuItem value="5">5 minutes</MenuItem>
                          <MenuItem value="15">15 minutes</MenuItem>
                          <MenuItem value="30">30 minutes</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Seuil critique</InputLabel>
                        <Select
                          value={securityCriticalLevel}
                          onChange={(e) => setSecurityCriticalLevel(e.target.value)}
                          label="Seuil critique"
                        >
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="5">5</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="15">15</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-container">
                <button className="save-button" onClick={handleSave}>
                  Sauvegarder les paramètres
                </button>
              </div>
            </>
          ) : (
            <div className="historique-view">
              <div className="historique-header">
                <h2>Historique des Configurations</h2>
                <div className="results-count">
                  {historiqueFiltree.length} configuration(s) trouvée(s)
                </div>
              </div>
              
              {historiqueFiltree.length === 0 ? (
                <Paper elevation={2} className="empty-state">
                  <p>Aucune configuration enregistrée pour le moment.</p>
                  <p className="secondary-text">
                    Les paramètres sauvegardés apparaîtront ici.
                  </p>
                </Paper>
              ) : (
                <Paper elevation={3} className="table-container">
                  <Table size="small">
                    <TableHead className="table-header">
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Énergie</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Début Pointe</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Fin Pointe</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Pointe Matin</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Pointe Soir</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Feux (s)</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Déchets</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Fréq. Déchets</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Heure Collecte</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Incidents</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Fréq. Sécurité</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Seuil Critique</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historiqueFiltree.map((entry, index) => (
                        <TableRow 
                          key={entry._id || index}
                          className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd table-row'}
                        >
                          <TableCell>{new Date(entry.date).toLocaleString()}</TableCell>
                          <TableCell>{entry.seuil_energie} kWh</TableCell>
                          <TableCell>{entry.debut_pointe}</TableCell>
                          <TableCell>{entry.fin_pointe}</TableCell>
                          <TableCell>{entry.matin_pointe}</TableCell>
                          <TableCell>{entry.soir_pointe}</TableCell>
                          <TableCell>{entry.intervalle_trafic}</TableCell>
                          <TableCell>{entry.seuil_dechet}%</TableCell>
                          <TableCell>{entry.frequence_deche}</TableCell>
                          <TableCell>{entry.temps_collect_dechet}</TableCell>
                          <TableCell>{entry.seuil_securite}</TableCell>
                          <TableCell>{entry.frequence_controle_securite}</TableCell>
                          <TableCell>{entry.niveau_critique_securite}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default Configuration;