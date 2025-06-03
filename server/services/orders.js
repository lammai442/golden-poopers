import Order from '../models/order.js';
import Cart from '../models/cart.js';

export async function createOrderFromCart(cartId) {
	const cart = await Cart.findOne({ cartId });
	if (!cart) return null;

	const total = cart.items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0
	);

	let existingOrder = await Order.findOne({ userId: cartId });

	if (!existingOrder) {
		console.log('Ny order');

		const newOrder = new Order({
			userId: cart.cartId,
			orders: cart.items.map((item) => ({
				prodId: item.prodId,
				title: item.title,
				price: item.price,
				qty: item.qty,
				total: total,
			})),
		});

		await newOrder.save();
		await Cart.deleteOne({ cartId });
		return newOrder;
	} else {
		console.log('Lägger till ny order i befintlig användare');

		cart.items.forEach((item) => {
			existingOrder.orders.push({
				prodId: item.prodId,
				title: item.title,
				price: item.price,
				qty: item.qty,
				total: total,
			});
		});

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
