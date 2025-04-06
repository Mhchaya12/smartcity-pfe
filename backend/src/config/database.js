// Configuration de la base de données
module.exports = {
  // Ajoutez vos paramètres de connexion à la base de données ici
  url: process.env.DATABASE_URL || 'votre_url_de_connexion',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
