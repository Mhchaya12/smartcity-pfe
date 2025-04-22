import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    data: [{ type: Number }],
    backgroundColor: [{ type: String }],
    borderColor: [{ type: String }],
    borderWidth: { type: Number },
    tension: { type: Number },
    fill: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const chartDataSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['energy', 'traffic', 'waste', 'security'], required: true },
    labels: [{ type: String }],
    datasets: [datasetSchema],
    lastUpdated: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const ChartData = mongoose.model('ChartData', chartDataSchema);
export default ChartData;