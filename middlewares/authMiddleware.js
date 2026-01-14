// Authentication Middleware - protects routes by verifying JWT tokens
import { verify } from '../services/jwtService.js';
import { getUserById } from '../services/userService.js';

// Middleware function to authenticate requests
export const authenticateToken = async (req, res, next) => {
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
    const user = await getUserById(decoded.userId);

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

// Authorization Middleware - checks if user is an admin
export const requireAdmin = (req, res, next) => {
  // Check if user is authenticated (should be set by authenticateToken middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Check if user is an admin
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  next();
};

// Authorization Middleware Factory - takes array of roles and returns middleware (OR condition)
export const requireRoles = (roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check if user has any of the required roles (OR condition)
    const hasRole = roles.some(role => {
      if (typeof role === 'function') {
        // If role is a function, call it with the user object
        return role(req.user);
      } else if (typeof role === 'string') {
        // If role is a string, check the user property
        return req.user[role] === true;
      }
      return false;
    });

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions. Required role(s): ' + roles.join(', ')
      });
    }

    next();
  };
};
