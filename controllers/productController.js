// Product Controller - handles HTTP requests and responses for products
import {
  getAllProducts as getAllProductsService,
  getProductById as getProductByIdService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from '../services/productService.js';

// Get all products
export const getAllProducts = async (req, res) => {
  const products = await getAllProductsService();
  res.json(products);
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await getProductByIdService(id);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
    // OR
    // next(error);
  }

  res.json(product);
};

// Create new product
export const createProduct = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  const newProduct = await createProductService({ name, price });
  res.status(201).json(newProduct);
};

// Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  const updatedProduct = await updateProductService(id, { name, price });

  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(updatedProduct);
};

// Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await deleteProductService(id);

  if (!deletedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully', product: deletedProduct });
};
