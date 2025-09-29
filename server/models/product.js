const mongoose = require('mongoose');

// Product schema for AI-generated custom clothing items
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Product name/title
  description: { type: String },                 // Product description
  image: { type: String, required: true },       // Image path/URL (stored in uploads folder)
  price: { type: Number, required: true },       // Product price in USD
  category: { type: String, required: true },    // Product category (e.g., 'mens-shirts')
  createdAt: { type: Date, default: Date.now }   // Timestamp when product was created
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
