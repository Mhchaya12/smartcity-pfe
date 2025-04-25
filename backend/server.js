import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Explicitly specify .env path
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import sensorRoutes from './routes/sensorRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import metricRoutes from './routes/metricRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import configRoutes from './routes/configRoutes.js';
import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import { startRealTimeUpdates } from './services/realTimeService.js';
import initData from './utils/initData.js';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(json());

app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/config', configRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);

// Validate MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity';
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not defined in .env, using default:', MONGODB_URI);
}

// MongoDB Connection
connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    console.log('MongoDB URI:', MONGODB_URI);
    await initData();
    startRealTimeUpdates(io);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit on connection failure
  });

// Server Start with Port Conflict Handling
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle server errors (e.g., EADDRINUSE)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port or free port ${PORT}.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    mongoose.connection.close();
    console.log('Server and MongoDB connection closed.');
    process.exit(0);
  });
});
