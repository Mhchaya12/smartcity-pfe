import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from "./routes/userRouter.js";
import alertRouter from "./routes/alertRouter.js";
import maintenanceRouter from "./routes/maintenanceRouter.js";
import configurationRouter from "./routes/configurationRouter.js";
import sensorDechetRouter from "./routes/sensorDechetRouter.js";
import sensorEnergieRouter from "./routes/sensorEnergieRouter.js";
import sensorSecuriteRouter from "./routes/sensorSecuriteRouter.js";
import sensorTransportRouter from "./routes/sensorTransportRouter.js";
import startDataGeneration from './services/sensorDataGenerator.js';
import { Server } from 'socket.io';
import http from 'http';
import SensorDechet from './models/sensorDechetModel.js';
import SensorEnergie from './models/sensorEnergieModel.js';
import SensorSecurite from './models/sensorSecuriteModel.js';
import SensorTransport from './models/sensorTransportModel.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/smartcity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
  // Démarrer la génération de données en temps réel après la connexion à MongoDB
  startDataGeneration();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/configuration', configurationRouter);
app.use('/api/sensors/dechets', sensorDechetRouter);
app.use('/api/sensors/energie', sensorEnergieRouter);
app.use('/api/sensors/securite', sensorSecuriteRouter);
app.use('/api/sensors/transport', sensorTransportRouter);

// Route de base
app.get('/', (req, res) => {
  res.send('Server is ready');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Create the HTTP server
const port = process.env.PORT || 5050;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const io = new Server(server);

// Fonction pour récupérer les données des capteurs
const getSensorData = async () => {
  try {
    const dechetSensors = await SensorDechet.find();
    const energieSensors = await SensorEnergie.find();
    const securiteSensors = await SensorSecurite.find();
    const transportSensors = await SensorTransport.find();

    return {
      dechets: dechetSensors,
      energie: energieSensors,
      securite: securiteSensors,
      transport: transportSensors
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données des capteurs:', error);
    return {};
  }
};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Émettre les données des capteurs toutes les 10 secondes
  setInterval(async () => {
    const sensorData = await getSensorData();
    socket.emit('sensorData', sensorData);
  }, 10000);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});