import Order from '../models/order.js';
import Cart from '../models/cart.js';

export async function createOrderFromCart(cartId) {
  const cart = await Cart.findOne({ cartId });
  if (!cart) return null;

  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order = new Order({
    cartId: cart.cartId,
    userId: cart.cartId.startsWith('guest-') ? null : cart.cartId,
    items: cart.items,
    total,
  });

  await order.save();

  // Remove the cart after order:
  await Cart.deleteOne({ cartId });

  return order;
}

export async function getAllOrders() {
  return Order.find({});
}

export async function getOrdersByUserId(userId) {
  return Order.find({ userId });
}