import { Router } from 'express';
import Menu from '../models/menus.js';

const router = Router();

// GET all menu
router.get('/', async (req, res, next) => {
	try {
		const menus = await Menu.find();
		res.json({
			menus,
			success: true,
		});
	} catch (err) {
		next(err);
	}
});

export default router;
