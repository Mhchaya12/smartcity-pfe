import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    sensorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },
    typeTask: { type: String, required: true },
    date: { type: Date, required: true },
    priorite: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance; 