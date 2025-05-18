import mongoose from 'mongoose';
import SensorSecurite from '../models/sensorSecuriteModel.js';

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/smartcity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const data = [
  {
    localisation: 'Avenue Habib-Bourguiba',
    anomalieDetection: 0,
    status: 'operational',
    dernier_mise_a_jour: new Date(),
    pourcentage: 0
  },
  {
    localisation: 'Rue de Marseille',
    anomalieDetection: 0,
    status: 'operational',
    dernier_mise_a_jour: new Date(),
    pourcentage: 0
  },
  {
    localisation: 'Rue de Rome',
    anomalieDetection: 0,
    status: 'operational',
    dernier_mise_a_jour: new Date(),
    pourcentage: 0
  }
];

const insertData = async () => {
  try {
    await SensorSecurite.deleteMany({});
    await SensorSecurite.insertMany(data);
    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    mongoose.disconnect();
  }
};

insertData(); 