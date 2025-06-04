import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
	prodId: String,
	title: String,
	price: Number,
	qty: Number,
});

const cartSchema = new Schema(
	{
		cartId: {
			type: String,
		},
		items: [cartItemSchema],
		total: {
			type: Number,
			required: true,
		},
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
	},
	{ timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
