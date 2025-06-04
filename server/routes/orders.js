import { Router } from 'express';
import {
	createOrderFromCart,
	getAllOrders,
	getOrdersByUserId,
} from '../services/orders.js';
import { generateDeliveryTime } from '../utils/index.js';

const router = Router();

// GET alla orders
router.get('/', async (req, res, next) => {
	try {
		const orders = await getAllOrders();
		res.json({ success: true, orders });
	} catch (err) {
		next(err);
	}
});

// GET orders by userId
router.get('/:userId', async (req, res, next) => {
	try {
		const { userId } = req.params;
		const orders = await getOrdersByUserId(userId);

		if (orders.length === 0) {
			return next({
				status: 404,
				message: 'Order not found',
			});
		}

		res.json({ success: true, orders });
	} catch (err) {
		next(err);
	}
});

// Skapa order från cartId
router.post('/', async (req, res, next) => {
	try {
		const { cartId } = req.body;
		if (!cartId) {
			return res
				.status(400)
				.json({ success: false, message: 'cartId is required' });
		}

		const order = await createOrderFromCart(cartId);

		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: 'Cart not found' });
		}
		const lastOrder = order.orders[order.orders.length - 1];

		const totalQty = lastOrder.items.reduce(
			(sum, item) => sum + item.qty,
			0
		);
		const deliveryTime = generateDeliveryTime(totalQty) + ' min';

		res.status(201).json({
			success: true,
			deliveryTime: deliveryTime,
			order: lastOrder,
		});
	} catch (err) {
		next(err);
	}
});

export default router;
