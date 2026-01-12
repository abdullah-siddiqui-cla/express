// User Service - handles user authentication and management
import { sign } from './jwtService.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Authenticate user with username and password from database
export const authenticateUser = async (username, password) => {
  // Find user by username
  const user = await User.findOne({ username });

  if (!user) {
    return null; // User not found
  }

  // Compare provided password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null; // Password doesn't match
  }

  // Return user without password
  const userObject = user.toObject();
  const { password: _, ...userWithoutPassword } = userObject;
  return userWithoutPassword;
};

// Generate JWT token for authenticated user
export const generateToken = (user) => {
  return sign({
    userId: user._id, // MongoDB uses _id instead of id
    username: user.username,
    email: user.email
  });
};

// Get user by ID (without password)
export const getUserById = async (id) => {
  // Use select('-password') to exclude password from the result
  const user = await User.findById(id).select('-password');
  return user;
};
