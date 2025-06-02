/* kolla om användaren är inloggad glöm ej global.user måste sättas */
export const authorizeUser = (req, res, next) => {
	if (!global.user) {
		return res
			.status(401)
			.json({ success: false, message: 'Unauthorized user' });
	}
	next();
};
