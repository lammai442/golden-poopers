import { Router } from 'express';
import { getCartById, updateCart } from '../services/cart.js';
import { getProductFromMenu } from '../services/products.js';
import { validatePutProductBody } from '../middlewares/validators.js';
import { v4 as uuid } from 'uuid';
import Cart from '../models/cart.js';

const router = Router();

// GET alla carts
router.get('/', async (req, res, next) => {
	try {
		const carts = await Cart.find();

		res.json({ success: true, carts: carts });
	} catch (error) {
		next(error);
	}
});

router.get('/:cartId', async (req, res, next) => {
	try {
		const { cartId } = req.params;
		const cart = await getCartById(cartId);

		if (!cart) {
			return res
				.status(404)
				.json({ success: false, message: 'Cart not found' });
		}

		res.json({
			success: true,
			cart: {
				cartId: cart.cartId,
				items: cart.items,
				discount: cart.discount,
				total: cart.total,
			},
		});
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
				message: 'Incorrect input of prodId, product not found',
			});
		}

		let userId;

		// Kontroll för inloggad annars guestId
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
			cart: {
				cartId: result.cartId,
				items: result.items,
				total: result.total,
				discount: result.discount,
				createdAt: result.createdAt,
				updatedAt: result.updatedAt,
			},
			userId: userId,
		});
	} catch (error) {
		next(error);
	}
});

export default router;
