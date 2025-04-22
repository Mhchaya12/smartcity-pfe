import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['info', 'warning', 'critical', 'success'], required: true },
    message: { type: String, required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, required: true },
    sensorId: { type: String, required: true },
    resolved: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;