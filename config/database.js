import mongoose from 'mongoose';

/**
 * Database Configuration
 * 
 * This module handles the MongoDB connection using Mongoose.
 * Make sure to set MONGODB_URI in your .env file before running the app.
 */

// MongoDB connection function
export const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variable
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

