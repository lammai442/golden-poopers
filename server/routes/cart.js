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

		const product = await getProductFromMenu(prodId);
		if (product) {
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
		}
	} else {
		next({
			status: 400,
			success: false,
			message: 'Not logged in',
		});
	}
});

export default router;
