import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', authenticateToken, productRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(3011, () => {
  console.log('Server is running on port 3011');
});