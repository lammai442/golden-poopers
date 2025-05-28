import User from '../models/user.js';

export async function doesUsernameExists(username) {
	try {
		const user = await User.findOne({ username: username });
		if (user) return user;
		else throw new Error('No user found');
	} catch (error) {
		console.log(error.message);
		return null;
	}
}
