import { Router } from 'express';
import { getCartById } from '../services/cart.js';

const router = Router();

router.get('/:cartId', async (req, res, next) => {
	try {
		const { cartId } = req.params;
		const cart = await getCartById(cartId);

		if (!cart) {
			return res.status(404).json({ success: false, message: 'Cart not found' });
		}

		res.json({ success: true, cart });
	} catch (err) {
		next(err);
	}
});

export default router;