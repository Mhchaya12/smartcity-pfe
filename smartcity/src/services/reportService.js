import axios from 'axios';

const API_URL = 'http://localhost:5050/api/reports';

// Get all reports
export const getAllReports = async () => {
  try {
    const response = await axios.get(API_URL);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

// Get single report
export const getReport = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

// Create new report
export const createReport = async (reportData) => {
  try {
    const response = await axios.post(API_URL, reportData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message || 'Failed to create report';
      const errorDetails = error.response.data.details;
      throw new Error(errorDetails ? `${errorMessage}: ${JSON.stringify(errorDetails)}` : errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check if the server is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

// Update report
export const updateReport = async (id, reportData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, reportData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

// Delete report
export const deleteReport = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}; 