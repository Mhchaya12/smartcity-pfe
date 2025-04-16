import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/User.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for testing'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test function to create a user
async function testCreateUser() {
  try {
    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Save the user
    await testUser.save();
    console.log('User created successfully:', testUser);

    // Find the user
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('User found:', foundUser);

    // Test password comparison
    const isPasswordValid = await foundUser.comparePassword('password123');
    console.log('Password validation:', isPasswordValid);

    // Clean up - delete the test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Test user deleted');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Test failed:', error);
    await mongoose.disconnect();
  }
}

// Run the test
testCreateUser(); 