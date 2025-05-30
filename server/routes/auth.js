import { Router } from 'express';
import User from '../models/user.js';
import { doesUsernameExists } from '../services/users.js';
import { validateAuthBody } from '../middlewares/validators.js';

const router = Router();

// POST - Register
router.post('/register', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({
				message: 'Username and password required',
				success: false,
			});
		}

		const exists = await User.findOne({ username });
		if (exists)
			return res
				.status(400)
				.json({ message: 'User already exists', success: false });

		const user = new User({
			username: username,
			password: password,
			role: 'User',
		});
		await user.save();

		res.status(201).json({ message: 'User registered', success: true });
	} catch (err) {
		next(err);
	}
});

// POST - Login
router.get('/login', validateAuthBody, async (req, res, next) => {
	const { username, password } = req.body;

	let exists = null;
	if (username && password) {
		exists = await doesUsernameExists(username);
	}
	res.json({
		success: true,
		user: exists,
	});
});

// GET - Logout
router.get('/logout', (req, res, next) => {
	global.user = null;
});

export default router;
