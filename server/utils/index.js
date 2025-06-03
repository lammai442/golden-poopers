export function generateDeliveryTime(qty) {
	const timeMakinCoffe = Math.round(qty * 0.5);
	const standardDeliveryTime = 10;

	const totalDeliverytime = timeMakinCoffe + standardDeliveryTime;
	return totalDeliverytime;
}

export function calculateThreeForTwo(price, qty, prodId) {
	if (prodId === 'prod-jespe') {
		if (qty >= 3) {
			return price;
		}
	} else next();
}

// En lista med kampanjer. Varje kampanj har ett ID, namn, vilka produkter som krävs och ett kampanjpris.
export const campaigns = [
	{
		id: 'combo-bryggkaffe-cortado',
		name: 'Bryggkaffe + Cortado för 60 kr',
		requiredItems: [
			{ prodId: 'prod-jespe', quantity: 1 }, // Kräver 1 Bryggkaffe
			{ prodId: 'prod-ebest', quantity: 1 }, // Kräver 1 Cortado
		],
		price: 60, // Kampanjpris när båda produkterna köps ihop
	},
];

// Funktion som kollar vilka kampanjer som går att applicera baserat på kundvagnen
export function checkCampaigns(cartItems) {
	const applied = []; // Här sparas kampanjer som kan användas

	// Loopa igenom alla kampanjer
	for (const campaign of campaigns) {
		// Kolla om alla produkter som krävs i kampanjen finns i kundvagnen med rätt antal
		const match = campaign.requiredItems.every((req) => {
			// Hitta produkten i kundvagnen som matchar produkt-id:t i kampanjen
			const item = cartItems.find((i) => i.prodId === req.prodId);
			// Returnera true om produkten finns OCH att kvantiteten är minst så stor som krävs
			return item && item.qty >= req.quantity;
		});

		// Om alla produkter finns i rätt antal, lägg till kampanjen i listan
		if (match) {
			applied.push(campaign);
		}
	}

	// Returnera alla kampanjer som kan appliceras
	return applied;
}

// Funktion som beräknar totalkostnaden med kampanjer applicerade
export function calculateTotalWithCampaigns(cartItems, campaigns) {
	let total = 0; // Totalpris startar på 0
	const used = {}; // Håller koll på produkter som redan använts i kampanjer

	// Gå igenom varje kampanj som ska appliceras
	for (const campaign of campaigns) {
		// Räkna ut hur många gånger kampanjen kan användas, baserat på minsta möjliga antal av alla produkter i kampanjen
		const maxUses = Math.min(
			// Kolla för varje produkt i kampanjen hur många gånger den kan täckas av kundvagnens kvantitet
			...campaign.requiredItems.map((req) => {
				// Hitta produkten i kundvagnen
				const item = cartItems.find((i) => i.prodId === req.prodId);
				// Räkna hur många hela gånger produkten täcker kampanjens krav
				return Math.floor(item.qty / req.quantity);
			})
		);

		// Om kampanjen kan användas minst en gång
		if (maxUses > 0) {
			// Lägg till kampanjens pris multiplicerat med hur många gånger den används
			total += campaign.price * maxUses;

			// Uppdatera 'used' så vi vet att vissa produkter använts i kampanjen
			for (const req of campaign.requiredItems) {
				used[req.prodId] =
					(used[req.prodId] || 0) + req.quantity * maxUses;
			}
		}
	}

	// Lägg till pris för produkter som inte är använda i kampanjer eller där det finns kvar extra kvantitet
	for (const item of cartItems) {
		const usedQty = used[item.prodId] || 0; // Hur många av produkten har redan använts i kampanjer
		const remainingQty = item.qty - usedQty; // Resterande antal produkter som inte täcks av kampanjer

		// Om det finns kvar produkter utan kampanj, lägg till deras pris
		if (remainingQty > 0) {
			total += item.price * remainingQty;
		}
	}

	// Returnera det slutgiltiga totalpriset
	return total;
}
