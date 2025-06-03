import User from '../models/user.js';

export async function findUser(username) {
	try {
		const user = await User.findOne({ username: username });
		return user;
	} catch (error) {
		next(error);
		return null;
	}
}
