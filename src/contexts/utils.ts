import type { PizzaDataType } from "../data/data";
import type { CartItemType } from "./types";

export function addPizza(
	cartItems: CartItemType[],
	pizza: PizzaDataType,
	options: Partial<Omit<CartItemType, "pizza" | "count">> = {},
): CartItemType[] {
	const idx = cartItems.findIndex((i) => i.pizza.name === pizza.name);
	if (idx >= 0) {
		const updated = [...cartItems];
		updated[idx] = { ...updated[idx], count: updated[idx].count + 1 };
		return updated;
	}
	return [
		...cartItems,
		{
			pizza,
			count: 1,
			size: options.size,
			crust: options.crust,
			adds: options.adds,
			addsPrice: options.addsPrice ?? 0,
		},
	];
}

export function setPizzaCountInCart(
	cartItems: CartItemType[],
	pizza: PizzaDataType,
	count: number,
): CartItemType[] {
	if (count <= 0) return cartItems.filter((i) => i.pizza.name !== pizza.name);
	return cartItems.map((item) =>
		item.pizza.name === pizza.name ? { ...item, count } : item,
	);
}

export function removePizzaFromCart(
	cartItems: CartItemType[],
	pizza: PizzaDataType,
) {
	return cartItems.filter((item) => item.pizza.name !== pizza.name);
}
