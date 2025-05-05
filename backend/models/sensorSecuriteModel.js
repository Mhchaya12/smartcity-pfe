import mongoose from 'mongoose';

const sensorSecuriteSchema = new mongoose.Schema(
  {
    localisation: { type: String, required: true },
    anomalieDetection: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ['operational', 'warning', 'critical', 'maintenance', 'offline'],
      default: 'operational'
    },
    dernier_mise_a_jour: { type: Date, default: Date.now },
    pourcentage: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const SensorSecurite = mongoose.model('SensorSecurite', sensorSecuriteSchema);
export default SensorSecurite; 