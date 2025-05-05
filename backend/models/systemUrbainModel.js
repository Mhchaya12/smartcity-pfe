import mongoose from 'mongoose';

const systemUrbainSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    localisation: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const SystemUrbain = mongoose.model('SystemUrbain', systemUrbainSchema);
export default SystemUrbain; 