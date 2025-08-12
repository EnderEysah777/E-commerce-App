const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const order = new Order({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    })),
    shippingAddress,
    totalPrice
  });

  await order.save();

  // Clear cart after placing order
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
