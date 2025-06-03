export function generateDeliveryTime(qty) {
	const timeMakinCoffe = Math.round(qty * 0.5);
	const standardDeliveryTime = 10;

	const totalDeliverytime = timeMakinCoffe + standardDeliveryTime;
	return totalDeliverytime;
}
