export function generateDeliveryTime(qty) {
	const timeMakinCoffe = Math.round(qty * 0.5);
	const standardDeliveryTime = 10;

	const totalDeliverytime = timeMakinCoffe + standardDeliveryTime;
	return totalDeliverytime;
}

export const calculateTotalCart = (cart) => {
	let total = cart.items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0
	);

	return total;
};
