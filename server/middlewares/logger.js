function logger(req, res, next) {
	const timestamp = new Date().toISOString();
	const method = req.method;
	const url = req.url;
	console.log(`[${timestamp}], ${method} ${url}`);
	// Här tas emot en nextfunktion som tar den vidare till nästa function
	next();
}

export default logger;
