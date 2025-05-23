import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Configuration from '../models/configurationModel.js';

const router = express.Router();

// Route pour initialiser la base de données avec des configurations
router.get('/seed', expressAsyncHandler(async (req, res) => {
  try {
    await Configuration.deleteMany({});
    const createdConfigurations = await Configuration.insertMany(data.configurations);
    res.send({ createdConfigurations });
  } catch (error) {
    res.status(500).send({ message: 'Error during seed process', error: error.message });
  }
}));

// Créer une configuration
router.post('/', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Received configuration data:', req.body);
    
    // Validation des données requises
    const requiredFields = [
      'seuil_energie',
      'debut_pointe',
      'fin_pointe',
      'matin_pointe',
      'soir_pointe',
      'intervalle_trafic',
      'seuil_dechet',
      'frequence_deche',
      'temps_collect_dechet',
      'seuil_securite',
      'frequence_controle_securite',
      'niveau_critique_securite'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({
        message: 'Champs manquants',
        missingFields
      });
    }

    // Validation des types de données
    const numericFields = [
      'seuil_energie',
      'intervalle_trafic',
      'seuil_dechet',
      'seuil_securite'
    ];

    const invalidNumericFields = numericFields.filter(field => 
      isNaN(Number(req.body[field]))
    );

    if (invalidNumericFields.length > 0) {
      console.log('Invalid numeric fields:', invalidNumericFields);
      return res.status(400).json({
        message: 'Champs numériques invalides',
        invalidFields: invalidNumericFields
      });
    }

    // Création de l'objet de configuration
    const configurationData = {
      date: new Date(),
      seuil_energie: Number(req.body.seuil_energie),
      debut_pointe: String(req.body.debut_pointe),
      fin_pointe: String(req.body.fin_pointe),
      matin_pointe: String(req.body.matin_pointe),
      soir_pointe: String(req.body.soir_pointe),
      intervalle_trafic: Number(req.body.intervalle_trafic),
      seuil_dechet: Number(req.body.seuil_dechet),
      frequence_deche: String(req.body.frequence_deche),
      temps_collect_dechet: String(req.body.temps_collect_dechet),
      seuil_securite: Number(req.body.seuil_securite),
      frequence_controle_securite: String(req.body.frequence_controle_securite),
      niveau_critique_securite: String(req.body.niveau_critique_securite)
    };

    console.log('Processed configuration data:', configurationData);

    const configuration = new Configuration(configurationData);
    const savedConfiguration = await configuration.save();
    
    console.log('Saved configuration:', savedConfiguration);
    res.status(201).json(savedConfiguration);
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({
      message: 'Erreur lors de la sauvegarde de la configuration',
      error: error.message,
      details: error.errors
    });
  }
}));

// Récupérer l'historique des configurations
router.get('/historique', expressAsyncHandler(async (req, res) => {
  try {
    console.log('Fetching configuration history...');
    const configurations = await Configuration.find()
      .sort({ date: -1 })
      .limit(100); // Limiter à 100 entrées pour éviter de surcharger
    
    console.log(`Found ${configurations.length} configurations`);
    res.json(configurations);
  } catch (error) {
    console.error('Error fetching configuration history:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des configurations',
      error: error.message
    });
  }
}));

// Lire une configuration par ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);
  if (!configuration) {
    return res.status(404).json({ message: 'Configuration non trouvée' });
  }
  res.json(configuration);
}));

// Lire toutes les configurations
router.get('/', expressAsyncHandler(async (req, res) => {
  const configurations = await Configuration.find({});
  res.send(configurations);
}));

// Mettre à jour une configuration
router.put('/:id', expressAsyncHandler(async (req, res) => {
  const configuration = await Configuration.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!configuration) {
    return res.status(404).json({ message: 'Configuration non trouvée' });
  }
  res.json(configuration);
}));

export default router; 