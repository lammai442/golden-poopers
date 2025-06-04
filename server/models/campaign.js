import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
	promos: [
		{
			prodId: { type: String, required: true },
			promoCode: { type: String, required: true },
		},
	],
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
