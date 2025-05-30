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
router.post('/login', validateAuthBody, async (req, res, next) => {
	try {
		const user = await doesUsernameExists(req.body.username);
		if (!user)
			return next({
				status: 400,
				message: 'No user with that name found',
			});

		if (user.password !== req.body.password)
			return next({
				status: 400,
				message: 'Username or password are incorrect',
			});

		global.user = user;
		res.json({
			success: true,
			message: 'User logged in successfully',
		});
	} catch (error) {
		next(error);
	}
});

// GET - Logout
router.get('/logout', (req, res) => {
	global.user = null;
	res.json({
		success: true,
		message: 'User logged out successfully',
	});
});
export default router;
