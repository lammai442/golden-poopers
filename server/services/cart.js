import Cart from '../models/cart.js';

export const getCartById = async (cartId) => {
	return await Cart.findOne({ cartId });
};