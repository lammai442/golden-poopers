import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const Schema = mongoose.Schema;
const orderItemSchema = new Schema({
	prodId: String,
	title: String,
	price: Number,
	qty: Number,
});

const orderSchema = new Schema({
	orderId: { type: String, default: () => 'order-' + uuid().slice(0, 5) },
	items: [orderItemSchema],
	total: { type: Number },
	discount: {
		usedPromo: {
			type: [String],
			default: [],
		},
		discountAmount: {
			type: Number,
			default: 0,
		},
	},
	createdAt: { type: Date, default: Date.now },
});

const orderAccountSchema = new Schema({
	userId: { type: String, required: true },
	orders: [orderSchema],
	createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderAccountSchema);

export default Order;
