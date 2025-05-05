import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    heure: { type: String, required: true },
    etat: { type: String, required: true },
    description: { type: String, required: true },
    local: { type: String, required: true },
    resolu: { type: Boolean, default: false },
    sensorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true }
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);
export default Alert; 