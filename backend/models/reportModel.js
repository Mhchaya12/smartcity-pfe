import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      required: true 
    },
    dateGeneration: { 
      type: Date, 
      default: Date.now 
    },
    type_rapport: { 
      type: String, 
      required: true 
    },
    titre_rapport: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    data: [{
      metric: String,
      value: Number,
      status: String,
      trend: String
    }],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report; 