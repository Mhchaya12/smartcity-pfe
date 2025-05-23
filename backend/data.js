import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'chayma User',
      email: 'admin@smartcity.com',
      password: bcrypt.hashSync('admin123', 8),
      role: 'administrator',
      status: 'active',
      lastLogin: new Date()
    },
    {
      name: 'Mayk Analyst',
      email: 'analyst@smartcity.com',
      password: bcrypt.hashSync('analyst123', 8),
      role: 'analyst',
      status: 'active',
      lastLogin: new Date()
    },
    {
      name: 'Mike Technician',
      email: 'tech@smartcity.com',
      password: bcrypt.hashSync('tech123', 8),
      role: 'technicien',
      status: 'active',
      lastLogin: new Date()
    }
  ],
  sensorDechets: [
    {
      localisation: "Avenue Habib-Bourguiba",
      niveaux_remplissage: 70,
      status: "warning",
      dernier_mise_a_jour: new Date(),
      pourcentage: 70,
    },
    {
      localisation: "Rue de Marseille",
      niveaux_remplissage: 10,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 10,
    },
    {
      localisation: "Rue de Rome",
      niveaux_remplissage: 90,
      status: "critical",
      dernier_mise_a_jour: new Date(),
      pourcentage: 90,
    },
    {
      localisation: "Avenue Mohammed-V",
      niveaux_remplissage: 50,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 50,
    },
  ],
  sensorEnergies: [
    {
      localisation: "Avenue Habib-Bourguiba",
      seuilConsomation: 1000,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 50,
    },
    {
      localisation: "Rue de Marseille",
      seuilConsomation: 2000,
      status: "warning",
      dernier_mise_a_jour: new Date(),
      pourcentage: 80,
    },
    {
      localisation: "Rue de Rome",
      seuilConsomation: 300,
      status: "maintenance",
      dernier_mise_a_jour: new Date(),
      pourcentage: 25,
    },
    {
      localisation: "Avenue Mohammed-V",
      seuilConsomation: 1500,
      status: "critical",
      dernier_mise_a_jour: new Date(),
      pourcentage: 95,
    },
  ],
  sensorSecurites: [
    {
      localisation: "Avenue Habib-Bourguiba",
      anomalieDetection: 3,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 20,
    },
    {
      localisation: "Rue de Marseille",
      anomalieDetection: 8,
      status: "warning",
      dernier_mise_a_jour: new Date(),
      pourcentage: 60,
    },
    {
      localisation: "Rue de Rome",
      anomalieDetection: 15,
      status: "critical",
      dernier_mise_a_jour: new Date(),
      pourcentage: 90,
    },
    {
      localisation: "Avenue Mohammed-V",
      anomalieDetection: 0,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 10,
    },
  ],
  sensorTransports: [
    {
      localisation: "Avenue Habib-Bourguiba",
      fluxActuelle: 200,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 40,
    },
    {
      localisation: "Rue de Marseille",
      fluxActuelle: 350,
      status: "critical",
      dernier_mise_a_jour: new Date(),
      pourcentage: 85,
    },
    {
      localisation: "Rue de Rome",
      fluxActuelle: 100,
      status: "operational",
      dernier_mise_a_jour: new Date(),
      pourcentage: 30,
    },
    {
      localisation: "Avenue Mohammed-V",
      fluxActuelle: 50,
      status: "maintenance",
      dernier_mise_a_jour: new Date(),
      pourcentage: 15,
    },
  ],
  alerts: [
    {
      date: new Date(),
      heure: "14:30",
      etat: "critique",
      description: "Niveau de remplissage des déchets critique",
      local: "Zone Nord",
      resolu: false,
      sensorId: "65f1a2b3c4d5e6f7g8h9i0j1" // ID fictif, à remplacer par un vrai ID de capteur
    },
    {
      date: new Date(),
      heure: "15:45",
      etat: "warning",
      description: "Consommation énergétique élevée",
      local: "Zone Sud",
      resolu: true,
      sensorId: "65f1a2b3c4d5e6f7g8h9i0j2" // ID fictif, à remplacer par un vrai ID de capteur
    }
  ],
  systemUrbains: [
    {
      nom: 'Système de Gestion des Déchets',
      type: 'dechet',
      status: 'active',
      date_derniere_mise_a_jour: new Date()
    },
    {
      nom: 'Système de Surveillance',
      type: 'securite',
      status: 'active',
      date_derniere_mise_a_jour: new Date()
    }
  ],
  configurations: [
    {
      date: new Date(),
      seuil_energie: 2000,
      debut_pointe: "08:00",
      fin_pointe: "18:00",
      matin_pointe: "07:00",
      soir_pointe: "19:00",
      intervalle_trafic: 30,
      seuil_dechet: 80,
      frequence_deche: 24,
      temps_collect_dechet: 120,
      seuil_securite: 75,
      frequence_controle_securite: 15,
      niveau_critique_securite: 90
    },
    {
      date: new Date(),
      seuil_energie: 1800,
      debut_pointe: "09:00",
      fin_pointe: "17:00",
      matin_pointe: "08:00",
      soir_pointe: "18:00",
      intervalle_trafic: 20,
      seuil_dechet: 70,
      frequence_deche: 12,
      temps_collect_dechet: 90,
      seuil_securite: 80,
      frequence_controle_securite: 10,
      niveau_critique_securite: 95
    }
  ],
  reports: [
    {
      type: "quotidien",
      dateGeneration: new Date(),
      type_rapport: "performance",
      titre_rapport: "Rapport de Performance Quotidien",
      description: "Analyse des performances des systèmes urbains pour la journée"
    },
    {
      type: "mensuel",
      dateGeneration: new Date(),
      type_rapport: "maintenance",
      titre_rapport: "Rapport de Maintenance Mensuel",
      description: "Synthèse des opérations de maintenance effectuées ce mois"
    }
  ],
  maintenances: [
    {
      sensorId: "65f1a2b3c4d5e6f7g8h9i0j1", // ID fictif, à remplacer par un vrai ID de capteur
      typeTask: "preventive",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
      priorite: "haute",
      status: "planifiée",
      description: "Maintenance préventive mensuelle du capteur de déchets"
    },
    {
      sensorId: "65f1a2b3c4d5e6f7g8h9i0j2", // ID fictif, à remplacer par un vrai ID de capteur
      typeTask: "corrective",
      date: new Date(),
      priorite: "urgente",
      status: "en cours",
      description: "Réparation du capteur de sécurité défectueux"
    }
  ]
};

export default data;
