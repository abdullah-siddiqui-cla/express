import mongoose from 'mongoose';

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);

export default Category;

