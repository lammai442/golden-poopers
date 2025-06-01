// Validering att det skickas med username & password i bodyn till inloggning
export function validateAuthBody(req, res, next) {
	const { username, password } = req.body;
	if (!username || !password) {
		next({
			status: 400,
			message: 'Both username AND password are required',
		});
	}

	next();
}

// Validering att det skickas med productId & qty i bodyn
export function validatePutProductBody(req, res, next) {
	const { prodId, qty } = req.body;

	if (!prodId || !qty) {
		return next({
			status: 400,
			message: 'Both productId and qty has to be included',
		});
	}

	next();
}
