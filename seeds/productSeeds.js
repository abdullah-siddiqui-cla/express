import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Sample product data
const products = [
  { name: 'Laptop', price: 999.99 },
  { name: 'Smartphone', price: 699.99 },
  { name: 'Headphones', price: 149.99 },
  { name: 'Keyboard', price: 79.99 },
  { name: 'Mouse', price: 49.99 },
  { name: 'Monitor', price: 299.99 },
  { name: 'Webcam', price: 89.99 },
  { name: 'USB Cable', price: 12.99 },
  { name: 'Desk Lamp', price: 34.99 },
  { name: 'Backpack', price: 59.99 }
];

// Function to seed products into the database
export const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Fetch all categories
    const categories = await Category.find({});
    if (categories.length === 0) {
      throw new Error('No categories found. Please seed categories first.');
    }

    // Randomly assign categories to products
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categories[Math.floor(Math.random() * categories.length)]._id
    }));

    // Insert new products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`${createdProducts.length} products seeded successfully`);

    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error.message);
    throw error;
  }
};

