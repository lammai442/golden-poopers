import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		userId: {
			type: String,
			required: true,
			unique: true,
			default: () => 'user-' + uuid().slice(0, 5),
		},
		role: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
