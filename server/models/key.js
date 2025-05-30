import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const keySchema = new Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

const Key = mongoose.model('Key', keySchema);

export default Key;
