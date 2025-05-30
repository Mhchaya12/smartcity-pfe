import axios from 'axios';

const API_URL = 'http://localhost:5000/api/maintenance';

export const maintenanceService = {
  // Get all maintenance tasks
  getAllMaintenanceTasks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single maintenance task by ID
  getMaintenanceTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new maintenance task
  createMaintenanceTask: async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a maintenance task
  updateMaintenanceTask: async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a maintenance task
  deleteMaintenanceTask: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 