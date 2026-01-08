import User from '../models/User.js';

// Sample user data
// Note: In production, passwords should be hashed using bcrypt
const users = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com'
  },
  {
    username: 'john_doe',
    password: 'password123',
    email: 'john.doe@example.com'
  },
  {
    username: 'jane_smith',
    password: 'password456',
    email: 'jane.smith@example.com'
  },
  {
    username: 'bob_wilson',
    password: 'password789',
    email: 'bob.wilson@example.com'
  },
  {
    username: 'alice_brown',
    password: 'password321',
    email: 'alice.brown@example.com'
  }
];

// Function to seed users into the database
export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert new users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users seeded successfully`);
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error.message);
    throw error;
  }
};

