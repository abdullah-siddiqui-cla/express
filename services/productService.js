// Product Service - handles all product-related business logic
import Product from '../models/Product.js';

// Get all products from database
export const getAllProducts = async () => {
  return await Product.find();
};

// Get product by ID from database
export const getProductById = async (id) => {
  return await Product.findById(id);
};

// Create new product in database
export const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

// Update product by ID in database
export const updateProduct = async (id, updateData) => {
  // findByIdAndUpdate returns the updated document
  // { new: true } option returns the modified document rather than the original
  return await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
};

// Delete product by ID from database
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
