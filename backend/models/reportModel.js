import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    dateGeneration: { type: Date, required: true },
    type_rapport: { type: String, required: true },
    titre_rapport: { type: String, required: true },
    description: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report; 