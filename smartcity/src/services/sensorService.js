import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

export const sensorService = {
  // Fetch all sensors of a specific type
  async getSensors(type) {
    try {
      const response = await axios.get(`${API_URL}/sensor${type.toLowerCase()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} sensors:`, error);
      return [];
    }
  },

  // Fetch all sensors data
  async getAllSensors() {
    try {
      const [dechets, energie, securite, transport] = await Promise.all([
        this.getSensors('dechet'),
        this.getSensors('energie'),
        this.getSensors('securite'),
        this.getSensors('transport')
      ]);

      return {
        dechets,
        energie,
        securite,
        transport
      };
    } catch (error) {
      console.error('Error fetching all sensors:', error);
      return {
        dechets: [],
        energie: [],
        securite: [],
        transport: []
      };
    }
  },

  // Get sensor by ID
  async getSensorById(type, id) {
    try {
      const response = await axios.get(`${API_URL}/sensor${type.toLowerCase()}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensor ${id}:`, error);
      return null;
    }
  },

  // Update sensor data
  async updateSensor(type, id, data) {
    try {
      const response = await axios.put(`${API_URL}/sensor${type.toLowerCase()}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating sensor ${id}:`, error);
      return null;
    }
  }
}; 