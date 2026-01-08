import 'dotenv/config'; // Load environment variables from .env file
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { seedProducts } from './productSeeds.js';
import { seedUsers } from './userSeeds.js';

// Main function to run all seeds
const runSeeds = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('\nStarting database seeding...\n');

    // Run all seed functions
    await seedUsers();
    await seedProducts();

    console.log('\nAll seeds completed successfully!\n');

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeds
runSeeds();

