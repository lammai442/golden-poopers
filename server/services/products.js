import Menu from '../models/menus.js';

export async function getProductFromMenu(prodId) {
	const product = await Menu.findOne({ prodId: prodId });
	return product;
}
