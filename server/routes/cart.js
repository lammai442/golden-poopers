import { Router } from 'express';
import { getCartById, updateCart } from '../services/cart.js';
import { getProductFromMenu } from '../services/products.js';
import { validatePutProductBody } from '../middlewares/validators.js';
import { v4 as uuid } from 'uuid';
import Cart from '../models/cart.js';
const router = Router();

/* GET all carts */
router.get('/', async (req, res, next) => {
  try {
    const carts = await Cart.find();

     /* Add total to all carts */
    const cartsWithTotal = carts.map((cart) => {
      const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.qty, 0
      );
      return {
        cartId: cart.cartId,
        items: cart.items,
        total,
      };
    });

    res.json({ success: true, carts: cartsWithTotal });
  } catch (error) {
    next(error);
  }
});


router.get('/:cartId', async (req, res, next) => {
	try {
		const { cartId } = req.params;
		const cart = await getCartById(cartId);

		if (!cart) {
			return res
				.status(404)
				.json({ success: false, message: 'Cart not found' });
		}
         
		/* Calculate total price of the cart */ 
		const totalPrice = cart.items.reduce((sum, item) => sum + item.price *item.qty, 0);


		res.json({ success: true, cart: { cartId: cart.cartId, items: cart.items }, total: totalPrice });
	} catch (err) {
		next(err);
	}
});

 /* Lägg till en produkt i kundvagnen */
router.put('/', validatePutProductBody, async (req, res, next) => {
	const { prodId, qty, guestId } = req.body;
	try {
		const product = await getProductFromMenu(prodId);

		if (!product) {
			return next({
				status: 404,
				message: 'Incorrect input of prodId, product not found',
			});
		}

		let userId;

		/* Kontroll för inloggad annars guestId */
		if (global.user && global.user.userId) {
			userId = global.user.userId;
		} else if (guestId) {
			userId = guestId;
		} else {
			userId = 'guest-' + uuid().slice(0, 5);
		}

		let result = await updateCart(userId, {
			prodId: product.prodId,
			title: product.title,
			price: product.price,
			qty: qty,
		});

		res.json({
			success: true,
			cart: result,
			userId: userId,
		});
	} catch (error) {
		next(error);
	}
});

export default router;
