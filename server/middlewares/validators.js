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
	const { prodId, qty, guestId } = req.body;

	if (!guestId.startsWith('guest-') || guestId.length !== 11) {
		return next({
			status: 400,
			message: "Incorrect input of guestId. It has to be 'guest-xxxxx'",
		});
	}

	if (!prodId || !qty) {
		return next({
			status: 400,
			message: 'Both productId and qty has to be included',
		});
	} else if (typeof qty !== 'number' || !Number.isInteger(qty)) {
		return next({
			status: 400,
			message:
				'Please enter a valid quantity. It must be a whole number without decimals.',
		});
	}

	next();
}
