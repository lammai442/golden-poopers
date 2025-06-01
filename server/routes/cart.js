import { Router } from 'express';
import { getCartById, updateCart } from '../services/cart.js';
import { getProductFromMenu } from '../services/products.js';
import { validatePutProductBody } from '../middlewares/validators.js';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/:cartId', async (req, res, next) => {
	try {
		const { cartId } = req.params;
		const cart = await getCartById(cartId);

		if (!cart) {
			return res
				.status(404)
				.json({ success: false, message: 'Cart not found' });
		}

		res.json({ success: true, cart });
	} catch (err) {
		next(err);
	}
});

// Lägg till en produkt i kundvagnen
router.put('/', validatePutProductBody, async (req, res, next) => {
	const { prodId, qty, guestId } = req.body;
	try {
		const product = await getProductFromMenu(prodId);

		if (!product) {
			return next({
				status: 404,
				message: 'Product not found',
			});
		}

		let userId;

		if (global.user && global.user.userId) {
			userId = global.user.userId;
		} else if (guestId) {
			userId = guestId;
		} else {
			userId = 'guest-' + uuid().slice(0, 5);
		}

		let result = await updateCart(userId, {
			prodId: product.prodId,
			title: product.title,
			price: product.price,
			qty: qty,
		});

		res.json({
			success: true,
			cart: result,
		});
	} catch (error) {
		next(error);
	}
});

//Ta bort en produkt ur kundvagnen
router.put(`/cartId/item/:prodId/decrease`, async (req, res, next) => {
	const { cartId, prodId } = req.params;

	try {
		const cart = await getCartById(cartId);

		if (!cart) {
			const error = new Error(`Cart not found`);
			error.status = 404;
			return next(error);
		}

		const item = cart.items.find((i) => i.prodId === prodId);
		if (!item) {
			const error = new Error(`Product not found in cart`);
			error.status = 404;
			return next(error);
		}

		item.qty -= 1;

		if (item.qty <= 0) {
			cart.items = cart.items.filter((i) => i.prodId !== prodId);
		}

		await cart.save();
		res.status(200).json(cart);
	} catch (err) {
		next(err);
	}
});

export default router;
