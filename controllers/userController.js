// User Controller - handles user authentication requests
import { authenticateUser, generateToken } from '../services/userService.js';

// Sign in user
export const signIn = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required'
    });
  }

  // Authenticate user
  const user = await authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid username or password'
    });
  }

  // Generate JWT token
  const token = generateToken(user);

  // Return success response with token
  res.json({
    success: true,
    message: 'Sign in successful',
    user: user,
    token: token
  });
};
