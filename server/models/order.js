import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  items: [
    {
      prodId: String,
      title: String,
      price: Number,
      qty: Number,
    }
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;