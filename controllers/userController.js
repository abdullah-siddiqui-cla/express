// User Controller - handles user authentication requests
import { authenticateUser, generateToken } from '../services/userService.js';
import { signInSchema } from '../validators/auth.js';

// Sign in user
export const signIn = async (req, res) => {
  let userData = await signInSchema.validate(req.body);

  let username = userData.username;
  let password = userData.password;

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
