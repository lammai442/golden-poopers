import mongoose from 'mongoose';
import {v4 as uuid} from 'uuid';

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  orderId: { type: String, default: () => 'order-' + uuid().slice(0, 5) },
  prodId: String,
  title: String,
  price: Number,
  qty: Number,
  total: { type: Number},
});

const orderSchema = new Schema(
  {
    userId: { type: String,required: true,
    },
    orders: [orderItemSchema],
    createdAt: { type: Date, default: Date.now },
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;