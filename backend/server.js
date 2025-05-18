import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import userRouter from "./routes/userRouter.js";
import alertRouter from "./routes/alertRouter.js";
import maintenanceRouter from "./routes/maintenanceRouter.js";
import configurationRouter from "./routes/configurationRouter.js";
import sensorDechetRouter from "./routes/sensorDechetRouter.js";
import sensorEnergieRouter from "./routes/sensorEnergieRouter.js";
import sensorSecuriteRouter from "./routes/sensorSecuriteRouter.js";
import sensorTransportRouter from "./routes/sensorTransportRouter.js";
import systemUrbainRouter from "./routes/systemUrbainRouter.js";
import reportRouter from "./routes/reportRouter.js";
//import { initializeSocketIO } from './services/sensorService.js';
import insertData from './services/insertdata.js';
dotenv.config();
const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/smartcity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
setInterval(insertData , 10000);

//Initialize Socket.IO
//initializeSocketIO(httpServer);

// Routes
app.use('/api/users', userRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/configuration', configurationRouter);
app.use('/api/sensordechet', sensorDechetRouter);
app.use('/api/sensorenergie', sensorEnergieRouter);
app.use('/api/sensorsecurite', sensorSecuriteRouter);
app.use('/api/sensortransport', sensorTransportRouter);
app.use('/api/system-urbain', systemUrbainRouter);
app.use('/api/reports', reportRouter);

app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5050;
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 