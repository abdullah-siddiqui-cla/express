// Product Routes - defines RESTful API endpoints for products
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /api/products - Create new product
router.post('/', createProduct);

// PUT /api/products/:id - Update product by ID
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Delete product by ID
router.delete('/:id', deleteProduct);

export default router;
