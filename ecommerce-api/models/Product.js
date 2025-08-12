const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },

  description: {
    type: String,
    required: [true, 'Please add a description']
  },

  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  
  category: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
