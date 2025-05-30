// Validering att det skickas med username & password i bodyn till inloggning
export function validateAuthBody(req, res, next) {
	if (req.body) {
		const { username, password } = req.body;
		if (username && password) next();
		else {
			res.status(400).json({
				success: false,
				message: 'Both username AND password are required',
			});
		}
	} else {
		res.status(400).json({
			success: false,
			message: 'No body found in request',
		});
	}
}

export function validatePutProductBody(req, res, next) {
	if (req.body) {
		const { prodId, qty } = req.body;
		if (prodId && qty) next();
		else {
			res.status(400).json({
				success: false,
				message: 'You have to include both productID and quantity',
			});
		}
	} else {
		res.status(400).json({
			success: false,
			message: 'No body found in request',
		});
	}
}
