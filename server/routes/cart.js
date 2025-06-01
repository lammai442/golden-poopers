import { Router } from 'express';
import { getCartById, updateCart } from '../services/cart.js';
import { getProductFromMenu } from '../services/products.js';
import { validatePutProductBody } from '../middlewares/validators.js';

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

// PUT a product to Cart
router.put('/', validatePutProductBody, async (req, res, next) => {
	if (global.user) {
		const { prodId, qty } = req.body;
		try {
			const product = await getProductFromMenu(prodId);

			if (!product) {
				const error = new Error(`Product not found`);
				error.status = 404;
				return next(error);
			}
			let result = await updateCart(global.user.userId, {
				prodId: product.prodId,
				title: product.title,
				price: product.price,
				qty: qty,
			});

			res.json({
				success: true,
				cart: result,
			});
		} catch (error) {}
	} else {
		next({
			status: 400,
			success: false,
			message: 'Not logged in',
		});
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
