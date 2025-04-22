import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Énergie', 'Transport', 'Déchets', 'Sécurité'], required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['operational', 'warning', 'critical', 'maintenance', 'offline'], required: true },
    lastUpdate: { type: Date, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    threshold: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Sensor = mongoose.model('Sensor', sensorSchema);
export default Sensor;