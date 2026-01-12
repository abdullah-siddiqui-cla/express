// Category Service - handles all category-related business logic
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Get all categories from database
export const getAllCategories = async () => {
  return await Category.find();
};

// Get category by ID from database (without products)
export const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Get category by ID with products populated
export const getCategoryByIdWithProducts = async (id) => {
  // 1. Find the category by ID
  const category = await Category.findById(id);
  if (!category) {
    return null;
  }

  // Get products that belong to this category
  // 2. Find the products that belong to this category
  const products = await Product.find({ category: id });

  // Convert category to object and add products
  const categoryObject = category.toObject();
  categoryObject.products = products;

  return categoryObject;
};

// Create new category in database
export const createCategory = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

// Update category by ID in database
export const updateCategory = async (id, updateData) => {
  // findByIdAndUpdate returns the updated document
  // { new: true } option returns the modified document rather than the original
  return await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
};

// Delete category by ID from database
export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};


// 1. We have product named p
// 2. Get category id from p.category_id
// 3. Find the category by category_id, say c
// 4. Find all products that have category_id = c