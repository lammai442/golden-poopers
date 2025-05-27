import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';

// Config
dotenv.config(); // Gör så att man kommer åt allt i env-filen
const app = express();
const PORT = process.env.PORT; // Istället för 8080 så refereras det till .env-filens PORT
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

// Middlewares
app.use(express.json());
app.use(logger);

// Routes

// En lyssnare för t ex uppkoppling mot databasen
database.on('error', (error) => console.log(error));
database.once('connected', () => {
	console.log('DB Connected');
	// Flyttar in nedangående kod så att den endast körs när allt är uppladdad med servern
	app.listen(PORT, () => {
		console.log(`Server is running on ${PORT}`);
	});
});

// Middleware - ErrorHandling ska ligga sist för att express ska hitta den när ett fel händer i route.
app.use(errorHandler);
