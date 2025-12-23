// Product Controller - handles HTTP requests and responses for products
import {
  getAllProducts as getAllProductsService,
  getProductById as getProductByIdService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from '../services/productService.js';

// Get all products
export const getAllProducts = (req, res) => {
  try {
    const products = getAllProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product by ID
export const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = getProductByIdService(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new product
export const createProduct = (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const newProduct = createProductService({ name, price });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product
export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const updatedProduct = updateProductService(id, { name, price });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product
export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = deleteProductService(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
