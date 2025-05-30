import Key from '../models/key.js';

/* Checka om en giltig api nyckel finns */
export const authorizeKey = async (req, res, next) => {
	try {
		const apiKey = req.query.key;

		if (!apiKey) {
			return res
				.status(401)
				.json({ success: false, message: 'API key is required' });
		}

		const validKey = await Key.findOne({ key: apiKey });
		if (!validKey) {
			return res
				.status(403)
				.json({ success: false, message: 'API key Invalid' });
		}

		console.log(`API key: ${apiKey} is valid`);

		next();
	} catch (err) {
		console.error('Error in middleware-authorizeKey', err);
		next(err);
	}
};

/* kolla om användaren är inloggad glöm ej global.user måste sättas */
export const authorizeUser = (req, res, next) => {
	if (!global.user) {
		return res
			.status(401)
			.json({ success: false, message: 'Unauthorized user' });
	}
	next();
};
