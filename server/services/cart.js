import Cart from '../models/cart.js';

export const getCartById = async (cartId) => {
	return await Cart.findOne({ cartId });
};

export async function updateCart(userId, product) {
	try {
		let cart = await getCartById(userId);
		if (!cart) {
			cart = await Cart.create({
				cartId: userId,
				items: [],
			});
		}
		console.log(product.prodId);
		console.log(cart);

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

		// Om items är tom ska hela carten tas bort
		if (cart.items.length === 0) {
			await Cart.findOneAndDelete({ cartId: userId });
			return null;
		}

		await cart.save();
		return cart;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}
