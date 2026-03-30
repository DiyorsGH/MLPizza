import type { PizzaDataType } from "../data/data";

export type CartItemType = {
	pizza: PizzaDataType;
	count: number;
	size?: string;
	crust?: string;
	adds?: string[];
	addsPrice: number;
};

export type CartContextType = {
	cartItems: CartItemType[];
	addPizzaToCart: (
		pizza: PizzaDataType,
		options?: Partial<Omit<CartItemType, "pizza" | "count">>,
	) => void;
	setPizzaCount: (pizza: PizzaDataType, count: number) => void;
	removePizza: (pizza: PizzaDataType) => void;
	clearCart: () => void;
	totalPrice: number;
	tax: number;
};
