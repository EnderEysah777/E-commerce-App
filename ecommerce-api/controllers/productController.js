const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    // Optional filters
    const { category, sort } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    let productsQuery = Product.find(query);

    if (sort === 'price_asc') productsQuery = productsQuery.sort({ price: 1 });
    if (sort === 'price_desc') productsQuery = productsQuery.sort({ price: -1 });
    if (sort === 'rating') productsQuery = productsQuery.sort({ rating: -1 });

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, description, price, category, imageUrl, stock, rating } = req.body;

  try {
    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      rating
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
