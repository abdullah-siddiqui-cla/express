import Category from '../models/Category.js';

// Sample category data
const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Computers', description: 'Computer hardware and accessories' },
  { name: 'Accessories', description: 'Various tech accessories' },
  { name: 'Office Supplies', description: 'Office and workspace items' },
  { name: 'Bags', description: 'Bags and carrying cases' }
];

// Function to seed categories into the database
export const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories seeded successfully`);
    
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error.message);
    throw error;
  }
};

