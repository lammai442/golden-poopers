import { Router } from 'express';
import User from '../models/user.js';
import { doesUsernameExists } from '../services/users.js';
import { validateAuthBody } from '../middlewares/validators.js';
import { v4 as uuid } from 'uuid';
import Key from '../models/key.js';
import { authorizeKey } from '../middlewares/authorize.js';

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
				.status(400).json({ 
					message: 'User already exists', 
					success: false 
				});

			// Skapande och sparande av ny apiKey till databasen
			const newApiKey = 'key-' + uuid().slice(0, 5);
			const key = new Key({
				key: newApiKey,
		});
		await key.save();

		const user = new User({
			username: username,
			password: password,
			role: 'User',
			key: newApiKey,
		});
		await user.save();

		res.status(201).json({ 
			message: 'User registered',
			success: true,  
			key : newApiKey, 
		});
	} catch (err) {
		next(err);
	}
});

// GET - Login
router.get('/login', validateAuthBody, async (req, res, next) => {
	try {
		const user = await doesUsernameExists(req.body.username);
		if (!user)
			return next({
				status: 400,
				message: 'No user with that name found',
				success: false,
			});

		if (user.password !== req.body.password)
			return next({
				status: 400,
				message: 'Username or password are incorrect',
			});

		global.user = user;
		res.json({
			message: 'User logged in successfully',
			success: true,
			key : user.key,
		});
	} catch (error) {
		next(error);
	}
});

// GET - Logout
router.get('/logout', (req, res) => {
	global.user = null;
	res.json({
		message: 'User logged out successfully',
		success: true,
	});
});
export default router;
