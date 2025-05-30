import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: props => `${props.value} n'est pas un email valide!`
      }
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['administrator', 'analyst', 'technicien'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;