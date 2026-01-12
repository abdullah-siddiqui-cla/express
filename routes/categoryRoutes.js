// Category Routes - defines RESTful API endpoints for categories
import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/:id - Get category by ID (with products)
router.get('/:id', getCategoryById);

// POST /api/categories - Create new category
router.post('/', createCategory);

// PUT /api/categories/:id - Update category by ID
router.put('/:id', updateCategory);

// DELETE /api/categories/:id - Delete category by ID
router.delete('/:id', deleteCategory);

export default router;

