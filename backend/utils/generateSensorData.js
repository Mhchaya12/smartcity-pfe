import { faker } from '@faker-js/faker';
import { SensorType, SensorStatus } from '../data copy/sharedData.js';

// Fonction pour générer des coordonnées aléatoires dans la région de Tunis
const generateTunisLocation = () => {
  // Coordonnées approximatives de Tunis
  const TUNIS_CENTER = {
    lat: 36.8065,
    lng: 10.1815
  };
  
  // Rayon maximum en degrés (environ 5km)
  const RADIUS = 0.045;

  return {
    latitude: TUNIS_CENTER.lat + (Math.random() - 0.5) * RADIUS,
    longitude: TUNIS_CENTER.lng + (Math.random() - 0.5) * RADIUS
  };
};

// Fonction pour générer des données aléatoires selon le type de capteur
const generateSensorValue = (type) => {
  switch (type) {
    case SensorType.ENERGIE:
      return faker.number.int({ min: 350, max: 550 }); // kWh
    case SensorType.DECHET:
      return faker.number.int({ min: 0, max: 100 }); // pourcentage
    case SensorType.TRANSPORT:
      return faker.number.int({ min: 2000, max: 4000 }); // véhicules/heure
    case SensorType.SECURITY:
      return faker.number.int({ min: 0, max: 5 }); // incidents
    default:
      return 0;
  }
};

// Fonction pour générer un statut de capteur basé sur la valeur
const determineSensorStatus = (type, value) => {
  switch (type) {
    case SensorType.ENERGIE:
      return value > 500 ? SensorStatus.WARNING : SensorStatus.OPERATIONAL;
    case SensorType.DECHET:
      return value > 80 ? SensorStatus.WARNING : SensorStatus.OPERATIONAL;
    case SensorType.TRANSPORT:
      return value > 3500 ? SensorStatus.WARNING : SensorStatus.OPERATIONAL;
    case SensorType.SECURITY:
      return value > 3 ? SensorStatus.WARNING : SensorStatus.OPERATIONAL;
    default:
      return SensorStatus.OPERATIONAL;
  }
};

// Fonction principale pour générer les données d'un capteur
const generateSensorData = () => {
  const type = faker.helpers.arrayElement(Object.values(SensorType));
  const value = generateSensorValue(type);
  const location = generateTunisLocation();
  
  return {
    sensorId: faker.string.uuid(),
    type,
    value,
    unit: type === SensorType.ENERGIE ? 'kWh' :
          type === SensorType.DECHET ? '%' :
          type === SensorType.TRANSPORT ? 'véh/h' : 'incidents',
    status: determineSensorStatus(type, value),
    location,
    timestamp: new Date(),
    batteryLevel: faker.number.int({ min: 0, max: 100 }),
    maintenanceRequired: faker.datatype.boolean({ probability: 0.1 })
  };
};

export { generateSensorData, generateTunisLocation };
