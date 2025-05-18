import SensorEnergie from '../models/sensorEnergieModel.js';
import SensorDechet from '../models/sensorDechetModel.js';
import SensorTransport from '../models/sensorTransportModel.js';
import SensorSecurite from '../models/sensorSecuriteModel.js';
import data from "../data.js"

const insertData = async () => {
  try {
    
    console.log("connected succes")
    console.log("hello insert");

     await SensorEnergie.insertMany(data.sensorEnergies);
     await SensorDechet.insertMany(data.sensorDechets);
     await SensorTransport.insertMany(data.sensorTransports);
     await SensorSecurite.insertMany(data.sensorSecurites);

    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } 
};
export default insertData ;