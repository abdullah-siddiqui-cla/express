// User Service - handles user authentication and management
import { sign } from './jwtService.js';

// Module-level state
const users = [
  { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com' },
  { id: 2, username: 'user', password: 'user123', email: 'user@example.com' },
];

// Authenticate user with username and password
export const authenticateUser = (username, password) => {
  const user = users.find(u => u.username === username);

  if (!user) {
    return null; // User not found
  }

  if (user.password !== password) {
    return null; // Password doesn't match
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Generate JWT token for authenticated user
export const generateToken = (user) => {
  return sign({
    userId: user.id,
    username: user.username,
    email: user.email
  });
};

// Get user by ID (without password)
export const getUserById = (id) => {
  const user = users.find(u => u.id === parseInt(id));
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
