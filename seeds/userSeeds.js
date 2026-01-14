import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Sample user data
const users = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    isAdmin: true
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

    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          username: user.username,
          password: hashedPassword,
          email: user.email,
          isAdmin: user.isAdmin || false
        };
      })
    );

    // Insert new users with hashed passwords
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`${createdUsers.length} users seeded successfully`);
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error.message);
    throw error;
  }
};

