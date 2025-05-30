import Cart from '../models/cart.js';

export const getCartById = async (cartId) => {
	return await Cart.findOne({ cartId });
};

export async function updateCart(userId, product) {
	try {
		const cart = await getCartById(userId);
		if (!cart) {
			cart = await Cart.create({
				cartId: userId,
				items: [],
			});
		}

		const item = cart.items.find((i) => i.prodId === product.prodId);
		if (item) {
			item.qty = product.qty;
		} else {
			cart.items.push(product);
		}

		if (product.qty === 0) {
			console.log('Radera!');

			cart.items = cart.items.filter((i) => i.prodId !== product.prodId);
		}

		await cart.save();
		return cart;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}
