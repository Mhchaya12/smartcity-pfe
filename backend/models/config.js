import mongoose from 'mongoose';

const configSchema = new mongoose.Schema(
  {
    energy: {
      threshold: { type: Number, required: true },
      checkFrequency: { type: Number, required: true },
    },
    waste: {
      threshold: { type: Number, required: true },
      checkFrequency: { type: Number, required: true },
    },
    transport: {
      threshold: { type: Number, required: true },
      checkFrequency: { type: Number, required: true },
    },
    security: {
      checkFrequency: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Config = mongoose.model('Config', configSchema);
export default Config;