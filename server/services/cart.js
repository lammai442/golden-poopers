import Cart from '../models/cart.js';
import Campaign from '../models/campaign.js';
import { calculateTotalCart } from '../utils/index.js';

export const getCartById = async (cartId) => {
	return Cart.findOne({ cartId });
};

export const calculateDiscount = async (cart, product) => {
	const productDiscountExists = await Campaign.findOne({
		threeForTwo: {
			$elemMatch: { promoCode: product.prodId },
		},
	});

	// Kontroll om användaren redan använt promo
	const hasUsedPromo = cart.discount.usedPromo.includes(product.prodId);

	if (product.qty >= 3 && productDiscountExists && !hasUsedPromo) {
		cart.discount.usedPromo.push(product.prodId);
		cart.discount.discountAmount += product.price;
	}
	if ((product.qty < 3 || !productDiscountExists) && hasUsedPromo) {
		cart.discount.usedPromo = cart.discount.usedPromo.filter(
			(p) => p !== product.prodId
		);
		cart.discount.discountAmount -= product.price;
	}

	return cart;
};

export async function updateCart(userId, product) {
	try {
		let cart = await getCartById(userId);
		if (!cart) {
			cart = await Cart.create({
				cartId: userId,
				total: 0,
				items: [],
				discount: {
					usedPromo: [],
					discountAmount: 0,
				},
			});
		}

		const item = cart.items.find((i) => i.prodId === product.prodId);
		if (item) {
			item.qty = product.qty;
		} else {
			cart.items.push(product);
		}

		cart.total = calculateTotalCart(cart);

		await calculateDiscount(cart, product);

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
