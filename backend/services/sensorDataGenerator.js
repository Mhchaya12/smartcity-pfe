import SensorDechet from '../models/sensorDechetModel.js';
import SensorEnergie from '../models/sensorEnergieModel.js';
import SensorSecurite from '../models/sensorSecuriteModel.js';
import SensorTransport from '../models/sensorTransportModel.js';

// Définir les statuts
const SENSOR_STATUSES = {
  OPERATIONAL: 'operational',
  WARNING: 'warning',
  CRITICAL: 'critical',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline'
};

// Fonction pour générer un nombre aléatoire dans une plage donnée
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fonction pour générer une localisation aléatoire
const getRandomLocation = () => {
  const locations = [
    'Avenue Habib-Bourguiba',
    'Rue de Marseille',
    'Rue de Rome',
    'Avenue Mohammed-V'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Fonction pour déterminer le statut en fonction du pourcentage
const determineStatus = (pourcentage) => {
  if (pourcentage > 80) return SENSOR_STATUSES.CRITICAL;
  if (pourcentage > 60) return SENSOR_STATUSES.WARNING;
  return SENSOR_STATUSES.OPERATIONAL;
};

// Fonction pour mettre à jour les capteurs de déchets
const updateDechetSensors = async () => {
  try {
    const sensors = await SensorDechet.find();
    for (const sensor of sensors) {
      const newNiveau = getRandomNumber(0, 100);
      const newPourcentage = newNiveau; // Pourcentage est directement le niveau de remplissage

      await SensorDechet.findByIdAndUpdate(sensor._id, {
        localisation: getRandomLocation(),
        niveaux_remplissage: newNiveau,
        pourcentage: newPourcentage,
        status: determineStatus(newPourcentage),
        dernier_mise_a_jour: new Date()
      });
    }
    console.log('Capteurs de déchets mis à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des capteurs de déchets:', error);
  }
};

// Fonction pour mettre à jour les capteurs d'énergie
const updateEnergieSensors = async () => {
  try {
    const sensors = await SensorEnergie.find();
    for (const sensor of sensors) {
      const newConsommation = getRandomNumber(0, 1000);
      const newPourcentage = (newConsommation / 1000) * 100;

      await SensorEnergie.findByIdAndUpdate(sensor._id, {
        localisation: getRandomLocation(),
        seuilConsomation: newConsommation,
        pourcentage: newPourcentage,
        status: determineStatus(newPourcentage),
        dernier_mise_a_jour: new Date()
      });
    }
    console.log('Capteurs d\'énergie mis à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des capteurs d\'énergie:', error);
  }
};

// Fonction pour mettre à jour les capteurs de sécurité
const updateSecuriteSensors = async () => {
  try {
    const sensors = await SensorSecurite.find();
    for (const sensor of sensors) {
      const newAnomalie = getRandomNumber(0, 100);
      const newPourcentage = newAnomalie; // Pourcentage est directement le niveau d'anomalie

      await SensorSecurite.findByIdAndUpdate(sensor._id, {
        localisation: getRandomLocation(),
        anomalieDetection: newAnomalie,
        pourcentage: newPourcentage,
        status: determineStatus(newPourcentage),
        dernier_mise_a_jour: new Date()
      });
    }
    console.log('Capteurs de sécurité mis à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des capteurs de sécurité:', error);
  }
};

// Fonction pour mettre à jour les capteurs de transport
const updateTransportSensors = async () => {
  try {
    const sensors = await SensorTransport.find();
    for (const sensor of sensors) {
      const newFlux = getRandomNumber(0, 1000);
      const newPourcentage = (newFlux / 1000) * 100;

      await SensorTransport.findByIdAndUpdate(sensor._id, {
        localisation: getRandomLocation(),
        fluxActuelle: newFlux,
        pourcentage: newPourcentage,
        status: determineStatus(newPourcentage),
        dernier_mise_a_jour: new Date()
      });
    }
    console.log('Capteurs de transport mis à jour');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des capteurs de transport:', error);
  }
};

// Fonction pour démarrer la génération de données
const startDataGeneration = () => {
  console.log('Démarrage de la génération de données en temps réel...');

  // Mettre à jour toutes les données immédiatement
  updateDechetSensors();
  updateEnergieSensors();
  updateSecuriteSensors();
  updateTransportSensors();

  // Configurer l'intervalle de mise à jour (10 secondes)
  setInterval(() => {
    updateDechetSensors();
    updateEnergieSensors();
    updateSecuriteSensors();
    updateTransportSensors();
  }, 10000);
  console.log('Génération de données en cours...');
};

export default startDataGeneration;