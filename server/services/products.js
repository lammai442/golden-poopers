import Menu from '../models/menus.js';

export async function getProductFromMenu(prodId) {
	try {
		const product = await Menu.findOne({ prodId: prodId });
		return product;
	} catch (error) {
		next(error);
		return null;
	}
}
