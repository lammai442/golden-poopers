import { Router } from 'express';
import Menu from '../models/menus.js';

const router = Router();

// GET all menu
router.get('/', async (req, res) => {
	const menu = await Menu.find();

	res.json({
		success: true,
		menu: menu,
	});
});

router.get('/', async (req, res, next) => {
	try {
		const todos = await Todo.find();
		res.json({ todos, success: true });
	} catch (err) {
		next(err);
	}
});

export default router;
