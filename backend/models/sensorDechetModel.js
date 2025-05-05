import mongoose from 'mongoose';

const sensorDechetSchema = new mongoose.Schema(
  {
    localisation: { type: String, required: true },
    niveaux_remplissage: { type: Number, default: 0 },
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

const SensorDechet = mongoose.model('SensorDechet', sensorDechetSchema);
export default SensorDechet; 