import Alert from '../models/alertModel.js';
import Maintenance from '../models/maintenanceModel.js';
import SensorSecurite from '../models/sensorSecuriteModel.js';
import SensorTransport from '../models/sensorTransportModel.js';
import SensorDechet from '../models/sensorDechetModel.js';
import SensorEnergie from '../models/sensorEnergieModel.js';
import mongoose from 'mongoose';

class AlertMaintenanceService {
  constructor(io) {
    if (!io) {
      throw new Error('Socket.IO instance is required');
    }
    this.io = io;
  }

  async checkExistingDataAndCreateAlerts() {
    try {
      // Vérifier les capteurs de sécurité
      const securiteSensors = await SensorSecurite.find();
      for (const sensor of securiteSensors) {
        await this.checkAndCreateAlertOrMaintenance(sensor, 'SensorSecurite');
      }

      // Vérifier les capteurs de transport
      const transportSensors = await SensorTransport.find();
      for (const sensor of transportSensors) {
        await this.checkAndCreateAlertOrMaintenance(sensor, 'SensorTransport');
      }

      // Vérifier les capteurs de déchets
      const dechetSensors = await SensorDechet.find();
      for (const sensor of dechetSensors) {
        await this.checkAndCreateAlertOrMaintenance(sensor, 'SensorDechet');
      }

      // Vérifier les capteurs d'énergie
      const energieSensors = await SensorEnergie.find();
      for (const sensor of energieSensors) {
        await this.checkAndCreateAlertOrMaintenance(sensor, 'SensorEnergie');
      }

      console.log('Finished checking existing data and creating alerts/maintenances');
    } catch (error) {
      console.error('Error checking existing data:', error);
    }
  }

  async checkAndCreateAlertOrMaintenance(sensor, sensorType) {
    try {
      if (!sensor._id) {
        console.error(`Invalid sensor ID for ${sensorType}`);
        return;
      }

      if (sensor.status === 'critical' || sensor.status === 'warning') {
        // Vérifier si une alerte similaire existe déjà
        const existingAlert = await Alert.findOne({
          sensorId: sensor._id,
          resolu: false,
          etat: sensor.status
        });

        if (!existingAlert) {
          await this.createAlert(sensor, sensorType);
        }
      }

      if (sensor.status === 'maintenance' || sensor.status === 'offline') {
        // Vérifier si une maintenance similaire existe déjà
        const existingMaintenance = await Maintenance.findOne({
          sensorId: sensor._id,
          status: 'pending'
        });

        if (!existingMaintenance) {
          await this.createMaintenance(sensor, sensorType);
        }
      }
    } catch (error) {
      console.error(`Error checking and creating alert/maintenance for ${sensorType}:`, error);
    }
  }

  async createAlert(sensorData, sensorType) {
    try {
      if (!this.io) {
        throw new Error('Socket.IO instance is not initialized');
      }

      if (!sensorData._id || !mongoose.Types.ObjectId.isValid(sensorData._id)) {
        console.error(`Invalid sensor ID for alert creation: ${sensorData._id}`);
        return null;
      }

      const now = new Date();
      const alert = new Alert({
        date: now,
        heure: now.toLocaleTimeString(),
        etat: sensorData.status,
        description: this.getAlertDescription(sensorData, sensorType),
        local: sensorData.localisation || 'Non spécifié',
        resolu: false,
        sensorId: new mongoose.Types.ObjectId(sensorData._id)
      });

      const savedAlert = await alert.save();
      if (savedAlert) {
        this.io.emit('newAlert', savedAlert);
        console.log(`Alert created for ${sensorType}: ${savedAlert._id}`);
      }
      return savedAlert;
    } catch (error) {
      console.error(`Error creating alert for ${sensorType}:`, error);
      return null;
    }
  }

  async createMaintenance(sensorData, sensorType) {
    try {
      if (!this.io) {
        throw new Error('Socket.IO instance is not initialized');
      }

      if (!sensorData._id || !mongoose.Types.ObjectId.isValid(sensorData._id)) {
        console.error(`Invalid sensor ID for maintenance creation: ${sensorData._id}`);
        return null;
      }

      const now = new Date();
      const maintenance = new Maintenance({
        sensorId: new mongoose.Types.ObjectId(sensorData._id),
        typeTask: 'Maintenance corrective',
        date: now,
        priorite: sensorData.status === 'offline' ? 'Haute' : 'Moyenne',
        status: 'pending',
        description: this.getMaintenanceDescription(sensorData, sensorType)
      });

      const savedMaintenance = await maintenance.save();
      if (savedMaintenance) {
        this.io.emit('newMaintenance', savedMaintenance);
        console.log(`Maintenance created for ${sensorType}: ${savedMaintenance._id}`);
      }
      return savedMaintenance;
    } catch (error) {
      console.error(`Error creating maintenance for ${sensorType}:`, error);
      return null;
    }
  }

  getAlertDescription(sensorData, sensorType) {
    const descriptions = {
      SensorSecurite: `Détection d'anomalie de sécurité: ${sensorData.pourcentage}%`,
      SensorTransport: `Flux de transport anormal: ${sensorData.pourcentage}%`,
      SensorDechet: `Niveau de remplissage critique: ${sensorData.pourcentage}%`,
      SensorEnergie: `Consommation énergétique élevée: ${sensorData.pourcentage}%`
    };
    return descriptions[sensorType] || `Alerte pour ${sensorType}: ${sensorData.pourcentage}%`;
  }

  getMaintenanceDescription(sensorData, sensorType) {
    const descriptions = {
      SensorSecurite: `Maintenance requise pour le système de sécurité - Niveau: ${sensorData.pourcentage}%`,
      SensorTransport: `Maintenance requise pour le système de transport - Niveau: ${sensorData.pourcentage}%`,
      SensorDechet: `Maintenance requise pour le système de déchets - Niveau: ${sensorData.pourcentage}%`,
      SensorEnergie: `Maintenance requise pour le système d'énergie - Niveau: ${sensorData.pourcentage}%`
    };
    return descriptions[sensorType] || `Maintenance requise pour ${sensorType} - Niveau: ${sensorData.pourcentage}%`;
  }

  async processSensorData(sensorData, sensorType) {
    if (!sensorData || !sensorData._id) {
      console.error(`Invalid sensor data for ${sensorType}`);
      return;
    }

    await this.checkAndCreateAlertOrMaintenance(sensorData, sensorType);
  }
}

export default AlertMaintenanceService; 