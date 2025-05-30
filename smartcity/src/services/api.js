import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

// Service pour les capteurs de déchet
export const wasteSensorService = {
  getAll: () => axios.get(`${API_URL}/sensordechet`),
  getById: (id) => axios.get(`${API_URL}/sensordechet/${id}`),
  create: (data) => axios.post(`${API_URL}/sensordechet`, data),
  update: (id, data) => axios.put(`${API_URL}/sensordechet/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/sensordechet/${id}`),
  seed: () => axios.get(`${API_URL}/sensordechet/seed`)
};

// Service pour les capteurs d'énergie
export const energySensorService = {
  getAll: () => axios.get(`${API_URL}/sensorenergie`),
  getById: (id) => axios.get(`${API_URL}/sensorenergie/${id}`),
  create: (data) => axios.post(`${API_URL}/sensorenergie`, data),
  update: (id, data) => axios.put(`${API_URL}/sensorenergie/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/sensorenergie/${id}`)
};

// Service pour les capteurs de sécurité
export const securitySensorService = {
  getAll: () => axios.get(`${API_URL}/sensorsecurite`),
  getById: (id) => axios.get(`${API_URL}/sensorsecurite/${id}`),
  create: (data) => axios.post(`${API_URL}/sensorsecurite`, data),
  update: (id, data) => axios.put(`${API_URL}/sensorsecurite/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/sensorsecurite/${id}`)
};

// Service pour les capteurs de transport
export const transportSensorService = {
  getAll: () => axios.get(`${API_URL}/sensortransport`),
  getById: (id) => axios.get(`${API_URL}/sensortransport/${id}`),
  create: (data) => axios.post(`${API_URL}/sensortransport`, data),
  update: (id, data) => axios.put(`${API_URL}/sensortransport/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/sensortransport/${id}`)
};

// Service pour les rapports
export const reportService = {
  getAll: () => axios.get(`${API_URL}/reports`),
  getById: (id) => axios.get(`${API_URL}/reports/${id}`),
  create: (data) => axios.post(`${API_URL}/reports`, data),
  update: (id, data) => axios.put(`${API_URL}/reports/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/reports/${id}`)
};

// Service pour les alertes
export const alertService = {
  getAll: () => axios.get(`${API_URL}/alerts`),
  create: (data) => axios.post(`${API_URL}/alerts`, data),
  update: (id, data) => axios.put(`${API_URL}/alerts/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/alerts/${id}`)
};

// Service pour la maintenance
export const maintenanceService = {
  getAll: () => axios.get(`${API_URL}/maintenance`),
  create: (data) => axios.post(`${API_URL}/maintenance`, data),
  update: (id, data) => axios.put(`${API_URL}/maintenance/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/maintenance/${id}`)
};

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}); 