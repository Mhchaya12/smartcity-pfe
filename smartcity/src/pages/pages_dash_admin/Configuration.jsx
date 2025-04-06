import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { TextField, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Header from '../../components/components_dash_admin/Header/Header';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import '../../styles/Configuration.css';

const Configuration = () => {
  const [energyThreshold, setEnergyThreshold] = useState(300);
  const [peakStart, setPeakStart] = useState('07:00');
  const [peakEnd, setPeakEnd] = useState('14:00');
  const [peakMorning, setPeakMorning] = useState('09:00');
  const [peakEvening, setPeakEvening] = useState('17:30');
  const [trafficInterval, setTrafficInterval] = useState(30);
  const [wasteThreshold, setWasteThreshold] = useState(85);
  const [wasteFrequency, setWasteFrequency] = useState('QUOTIDIENNE');
  const [wasteTime, setWasteTime] = useState('08:15');
  const [securityIncidentThreshold, setSecurityIncidentThreshold] = useState(1);
  const [securityCheckFrequency, setSecurityCheckFrequency] = useState('15 minutes');
  const [securityCriticalLevel, setSecurityCriticalLevel] = useState(2);

  // État pour l'historique et l'affichage
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleHistoryClick = () => {
    setShowHistory(!showHistory); // Basculer l'affichage du tableau
  };

  return (
    <Layout>
      <Header title="Configuration des seuils" />
      <div className="settings-container">
        <h1>Configuration des Seuils</h1>
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
                    <MenuItem value="5 minutes">5 minutes</MenuItem>
                    <MenuItem value="15 minutes">15 minutes</MenuItem>
                    <MenuItem value="30 minutes">30 minutes</MenuItem>
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
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
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
          <button className="history-button" onClick={handleHistoryClick}>
            {showHistory ? 'Masquer l\'historique' : 'Historique de configuration'}
          </button>
        </div>

        {/* Tableau historique (affiché conditionnellement) */}
        {showHistory && (
          <div className="history-section">
            <h2>Historique des Configurations</h2>
            {history.length === 0 ? (
              <p>Aucune configuration enregistrée pour le moment.</p>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Énergie (kWh)</TableCell>
                    <TableCell>Début Pointe</TableCell>
                    <TableCell>Fin Pointe</TableCell>
                    <TableCell>Pointe Matin</TableCell>
                    <TableCell>Pointe Soir</TableCell>
                    <TableCell>Intervalle Feux (s)</TableCell>
                    <TableCell>Déchets (%)</TableCell>
                    <TableCell>Fréq. Déchets</TableCell>
                    <TableCell>Heure Collecte</TableCell>
                    <TableCell>Incidents</TableCell>
                    <TableCell>Fréq. Sécurité</TableCell>
                    <TableCell>Seuil Critique</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.energyThreshold}</TableCell>
                      <TableCell>{entry.peakStart}</TableCell>
                      <TableCell>{entry.peakEnd}</TableCell>
                      <TableCell>{entry.peakMorning}</TableCell>
                      <TableCell>{entry.peakEvening}</TableCell>
                      <TableCell>{entry.trafficInterval}</TableCell>
                      <TableCell>{entry.wasteThreshold}</TableCell>
                      <TableCell>{entry.wasteFrequency}</TableCell>
                      <TableCell>{entry.wasteTime}</TableCell>
                      <TableCell>{entry.securityIncidentThreshold}</TableCell>
                      <TableCell>{entry.securityCheckFrequency}</TableCell>
                      <TableCell>{entry.securityCriticalLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Configuration;