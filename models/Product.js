import mongoose from 'mongoose';

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // OR
    // type: mongoose.Schema.Types.String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;

