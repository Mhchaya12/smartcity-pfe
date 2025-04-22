import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { TextField, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import Header from '../../components/components_dash_admin/Header/Header';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import { initialConfigSettings } from '../../data/adminData'; // Import from adminData.js
import '../../styles/Configuration.css';

const Configuration = () => {
  const [energyThreshold, setEnergyThreshold] = useState(initialConfigSettings.energyThreshold);
  const [peakStart, setPeakStart] = useState(initialConfigSettings.peakStart);
  const [peakEnd, setPeakEnd] = useState(initialConfigSettings.peakEnd);
  const [peakMorning, setPeakMorning] = useState(initialConfigSettings.peakMorning);
  const [peakEvening, setPeakEvening] = useState(initialConfigSettings.peakEvening);
  const [trafficInterval, setTrafficInterval] = useState(initialConfigSettings.trafficInterval);
  const [wasteThreshold, setWasteThreshold] = useState(initialConfigSettings.wasteThreshold);
  const [wasteFrequency, setWasteFrequency] = useState(initialConfigSettings.wasteFrequency || 'QUOTIDIENNE');
  const [wasteTime, setWasteTime] = useState(initialConfigSettings.wasteTime);
  const [securityIncidentThreshold, setSecurityIncidentThreshold] = useState(initialConfigSettings.securityIncidentThreshold);
  const [securityCheckFrequency, setSecurityCheckFrequency] = useState(initialConfigSettings.securityCheckFrequency || '15 minutes');
  const [securityCriticalLevel, setSecurityCriticalLevel] = useState(initialConfigSettings.securityCriticalLevel || '2');

  // État pour l'historique et l'affichage
  const [history, setHistory] = useState([]);
  const [vueActive, setVueActive] = useState('config'); // 'config' ou 'historique'
  const [termeRecherche, setTermeRecherche] = useState('');

  const handleSave = () => {
    const newConfig = {
      date: new Date().toLocaleString(),
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
      securityCriticalLevel,
    };
    setHistory([...history, newConfig]);
    console.log('Settings saved:', newConfig);
  };

  const gererChangementVue = () => {
    setVueActive(vueActive === 'config' ? 'historique' : 'config');
    setTermeRecherche(''); // Réinitialiser la recherche lors du changement de vue
  };

  const gererRecherche = (e) => {
    setTermeRecherche(e.target.value);
  };

  const historiqueFiltree = history.filter(item =>
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <Layout>
      <Header title="Configuration des seuils" />
      <div className="settings-container">
        <h1>Configuration des Seuils</h1>
        
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

        {vueActive === 'config' ? (
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
                        key={index}
                        className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd table-row'}
                      >
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.energyThreshold} kWh</TableCell>
                        <TableCell>{entry.peakStart}</TableCell>
                        <TableCell>{entry.peakEnd}</TableCell>
                        <TableCell>{entry.peakMorning}</TableCell>
                        <TableCell>{entry.peakEvening}</TableCell>
                        <TableCell>{entry.trafficInterval}</TableCell>
                        <TableCell>{entry.wasteThreshold}%</TableCell>
                        <TableCell>{entry.wasteFrequency}</TableCell>
                        <TableCell>{entry.wasteTime}</TableCell>
                        <TableCell>{entry.securityIncidentThreshold}</TableCell>
                        <TableCell>{entry.securityCheckFrequency}</TableCell>
                        <TableCell>{entry.securityCriticalLevel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Configuration;