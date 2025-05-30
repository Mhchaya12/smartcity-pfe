import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5050';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
      
      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });
    }
    return this.socket;
  }

  subscribeToSensorUpdates(sensorType, callback) {
    if (!this.socket) {
      this.connect();
    }

    const eventName = `update${sensorType}`;
    this.socket.on(eventName, callback);
    
    // Store the listener for cleanup
    if (!this.listeners.has(sensorType)) {
      this.listeners.set(sensorType, new Set());
    }
    this.listeners.get(sensorType).add(callback);
  }

  unsubscribeFromSensorUpdates(sensorType, callback) {
    if (this.socket && this.listeners.has(sensorType)) {
      const eventName = `update${sensorType}`;
      this.socket.off(eventName, callback);
      this.listeners.get(sensorType).delete(callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }
}

export const socketService = new SocketService(); 