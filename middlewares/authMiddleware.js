// Authentication Middleware - protects routes by verifying JWT tokens
import { verify } from '../services/jwtService.js';
import { getUserById } from '../services/userService.js';

// Middleware function to authenticate requests
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify the token
    const decoded = verify(token);

    // Get user details and attach to request
    const user = getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    // Attach user to request object for use in subsequent middleware/controllers
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};
