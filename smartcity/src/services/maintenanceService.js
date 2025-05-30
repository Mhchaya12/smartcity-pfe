import axios from 'axios';

const API_URL = 'http://localhost:5050/api/maintenance';

export const maintenanceService = {
  // Get all maintenance tasks
  getAllMaintenanceTasks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
      throw error;
    }
  },

  // Get a single maintenance task by ID
  getMaintenanceTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance task:', error);
      throw error;
    }
  },

  // Create a new maintenance task
  createMaintenanceTask: async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating maintenance task:', error);
      throw error;
    }
  },

  // Update a maintenance task
  updateMaintenanceTask: async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating maintenance task:', error);
      throw error;
    }
  },

  // Delete a maintenance task
  deleteMaintenanceTask: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting maintenance task:', error);
      throw error;
    }
  }
}; 