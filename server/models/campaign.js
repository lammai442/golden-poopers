import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
	prodId: [],
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
