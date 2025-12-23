import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Sign a JWT token
export const sign = (payload, expiresIn = '24h') => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
  return token;
};

// Verify a JWT token
export const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
