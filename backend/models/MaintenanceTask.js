import mongoose from 'mongoose';

const maintenanceTaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sensorId: { type: String, required: true },
    sensorName: { type: String, required: true },
    taskType: { type: String, enum: ['replacement', 'repair', 'calibration', 'inspection'], required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], required: true },
    notes: { type: String },
    assignedTo: { type: String },
  },
  {
    timestamps: true,
  }
);

const MaintenanceTask = mongoose.model('MaintenanceTask', maintenanceTaskSchema);
export default MaintenanceTask;