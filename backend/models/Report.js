import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sector: { type: String, required: true },
    createdAt: { type: Date, required: true },
    lastUpdated: { type: Date, required: true },
    description: { type: String },
    data: [
      {
        metric: String,
        value: Number,
        status: String,
        trend: String,
      },
    ],
    isScheduled: { type: Boolean, default: false },
    scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly'] },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;