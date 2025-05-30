import { Router } from 'express';

const router = Router();

// GET cart by user
router.get('/:userid', async (req, res, next) => {
	// Hämtad exempel från todos
	// try {
	// 	const todos = await Todo.find({ userId: req.params.userid });
	// 	res.json({ todos, success: true });
	// } catch (err) {
	// 	next(err);
	// }
});

// PUT

export default router;
