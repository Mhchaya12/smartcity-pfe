import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Énergie', 'Transport', 'Déchets', 'Sécurité'], required: true },
    primaryMetric: {
      title: { type: String, required: true },
      value: { type: String, required: true },
      icon: { type: String },
      iconClass: { type: String },
      percentage: { type: Number },
      comparison: { type: String },
      label: { type: String },
    },
    lastUpdated: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Metric = mongoose.model('Metric', metricSchema);
export default Metric;