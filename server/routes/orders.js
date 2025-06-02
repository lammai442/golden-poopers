import { Router } from 'express';
import { createOrderFromCart, getAllOrders, getOrdersByUserId } from '../services/orders.js';

const router = Router();

// Get all orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

// Get orders by userId
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const orders = await getOrdersByUserId(userId);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

// Create order from cartId
router.post('/', async (req, res, next) => {
  try {
    const { cartId } = req.body;
    if (!cartId) {
      return res.status(400).json({ success: false, message: 'cartId is required' });
    }

    const order = await createOrderFromCart(cartId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

export default router;
