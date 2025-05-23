import SensorEnergie from '../models/sensorEnergieModel.js';
import SensorDechet from '../models/sensorDechetModel.js';
import SensorTransport from '../models/sensorTransportModel.js';
import SensorSecurite from '../models/sensorSecuriteModel.js';




// Liste des localisations prédéfinies
const localisations = [
  "Avenue Habib-Bourguiba",
  "Rue de Marseille",
  "Rue de Rome",
  "Avenue Mohammed-V"
];

// Fonction pour générer un statut basé sur une valeur et des seuils
function determinerStatut(valeur, seuils) {
  if (valeur >= seuils.critical) return "critical";
  if (valeur >= seuils.warning) return "warning";
  if (valeur <= seuils.maintenance) return "maintenance";
  return "operational";
}

// Fonction pour sélectionner une localisation aléatoire
function genererLocalisation() {
  return localisations[Math.floor(Math.random() * localisations.length)];
}

// Fonction pour générer les données des capteurs
function genererDonneesCapteurs() {
  const sensorDechets = [];
  const sensorEnergies = [];
  const sensorSecurites = [];
  const sensorTransports = [];

  // Générer 4 entrées pour chaque type de capteur
  for (let i = 0; i < 1; i++) {
    // SensorDechets
    const niveaux_remplissage = Math.floor(Math.random() * 100); // 0 à 100
    sensorDechets.push({
      localisation: genererLocalisation(),
      niveaux_remplissage,
      status: determinerStatut(niveaux_remplissage, { critical: 90, warning: 70, maintenance: 10 }),
      dernier_mise_a_jour: new Date(),
      pourcentage: niveaux_remplissage,
    });

    // SensorEnergies
    const seuilConsomation = Math.floor(Math.random() * 6000) + 100; // 100 à 6100
    sensorEnergies.push({
      localisation: genererLocalisation(),
      seuilConsomation,
      status: determinerStatut(seuilConsomation, { critical: 5800, warning: 4500, maintenance: 300 }),
      dernier_mise_a_jour: new Date(),
      pourcentage: Math.min(Math.floor((seuilConsomation / 6000) * 100), 100),
    });

    // SensorSecurites
    const anomalieDetection = Math.floor(Math.random() * 20); // 0 à 19
    sensorSecurites.push({
      localisation: genererLocalisation(),
      anomalieDetection,
      status: determinerStatut(anomalieDetection, { critical: 15, warning: 8, maintenance: 0 }),
      dernier_mise_a_jour: new Date(),
      pourcentage: Math.min(Math.floor((anomalieDetection / 20) * 100), 100),
    });

    // SensorTransports
    const fluxActuelle = Math.floor(Math.random() * 400); // 0 à 399
    sensorTransports.push({
      localisation: genererLocalisation(),
      fluxActuelle,
      status: determinerStatut(fluxActuelle, { critical: 350, warning: 200, maintenance: 50 }),
      dernier_mise_a_jour: new Date(),
      pourcentage: Math.min(Math.floor((fluxActuelle / 400) * 100), 100),
    });
  }

  return {
    sensorDechets,
    sensorEnergies,
    sensorSecurites,
    sensorTransports,
  };
}

const insertData = async (io) => {
  try {
    const data = genererDonneesCapteurs();
    
    console.log("connected success");
    console.log("hello insert");



      const insertedDechets = await SensorDechet.insertMany(data.sensorDechets);
      io.emit('updateDechets', insertedDechets);

    
    const insertedEnergie = await SensorEnergie.insertMany(data.sensorEnergies);
    io.emit('updateEnergie', insertedEnergie);
    

    const insertedSecurite = await SensorSecurite.insertMany(data.sensorSecurites);
      io.emit('updateSecurite', insertedSecurite);

    


      const insertedTransport = await SensorTransport.insertMany(data.sensorTransports);
      io.emit('updateTransport', insertedTransport);


    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } 
};

export default insertData;