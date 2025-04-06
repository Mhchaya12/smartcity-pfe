require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const SensorDataSchema = new mongoose.Schema({
  type: String,
  value: Number,
  unit: String,
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', SensorDataSchema);

function generateData() {
  const sensors = [
    { type: 'energy', value: Math.random() * 1000, unit: 'kWh' },
    { type: 'waste', value: Math.random() * 500, unit: 'kg' },
    { type: 'transport', value: Math.random() * 120, unit: 'km/h' },
    { type: 'security', value: Math.floor(Math.random() * 2), unit: 'motion' }
  ];

  sensors.forEach(async sensor => {
    const data = new SensorData(sensor);
    await data.save();
    console.log(`Saved ${sensor.type} data: ${sensor.value} ${sensor.unit}`);
  });
}

// Génère toutes les 10 secondes
setInterval(generateData, 10000);
