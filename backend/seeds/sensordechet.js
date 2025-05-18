import mongoose from 'mongoose';
import SensorDechet from '../models/sensorDechetModel.js';
import data from '../data.js';

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/smartcity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});



const insertData = async () => {
  try {
    await SensorDechet.deleteMany({});
    await SensorDechet.insertMany(data.sensorDechets);
    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    mongoose.disconnect();
  }
};

insertData(); 