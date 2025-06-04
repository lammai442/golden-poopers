import Order from '../models/order.js';
import Cart from '../models/cart.js';

export async function createOrderFromCart(cartId) {
	const cart = await Cart.findOne({ cartId });
	if (!cart) return null;

	console.log(cart);

	let existingOrder = await Order.findOne({ userId: cartId });

	if (!existingOrder) {
		console.log('Ny orderaccount');

		const newOrder = new Order({
			userId: cart.cartId,
			orders: cart,
		});

		await newOrder.save();
		await Cart.deleteOne({ cartId });
		return newOrder;
	} else {
		console.log('Lägger till ny order i befintlig användare');
		existingOrder.orders.push(cart);

		await existingOrder.save();
		await Cart.deleteOne({ cartId });
		return existingOrder;
	}
}

export async function getAllOrders() {
	return Order.find({});
}

export async function getOrdersByUserId(userId) {
	return Order.find({ userId });
}
