import mongoose from 'mongoose';

const sensorTransportSchema = new mongoose.Schema(
  {
    localisation: { type: String, required: true },
    fluxActuelle: { type: Number, default: 0 },
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

const SensorTransport = mongoose.model('SensorTransport', sensorTransportSchema);
export default SensorTransport; 