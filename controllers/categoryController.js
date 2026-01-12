// Category Controller - handles HTTP requests and responses for categories
import {
  getAllCategories as getAllCategoriesService,
  getCategoryById as getCategoryByIdService,
  getCategoryByIdWithProducts as getCategoryByIdWithProductsService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService
} from '../services/categoryService.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  const categories = await getAllCategoriesService();
  res.json(categories);
};

// Get category by ID (with products)
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryByIdWithProductsService(id);

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  res.json(category);
};

// Create new category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newCategory = await createCategoryService({ name, description });
  res.status(201).json(newCategory);
};

// Update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const updatedCategory = await updateCategoryService(id, { name, description });

  if (!updatedCategory) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json(updatedCategory);
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await deleteCategoryService(id);

  if (!deletedCategory) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json({ message: 'Category deleted successfully', category: deletedCategory });
};

