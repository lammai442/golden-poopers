import { Router } from 'express';
import Menu from '../models/menus.js';

const router = Router();

// GET all menu
router.get('/', async (req, res, next) => {
	try {
		const menus = await Menu.find();

		if (!menus) {
			return next({
				status: 404,
				message: 'Menus not found',
			});
		}

		res.json({
			success: true,
			menus,
		});
	} catch (err) {
		next(err);
	}
});

export default router;
