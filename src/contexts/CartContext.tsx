import type { ReactNode } from "react";
import { createContext, useEffect, useMemo, useState } from "react";
import type { PizzaDataType } from "../data/data";
import { supabase } from "../lib/supabase";
import {
	getCartStorageKey,
	getStorageScope,
	readStorageJson,
	writeStorageJson,
} from "../utils/storage";
import type { CartContextType, CartItemType } from "./types";
import { addPizza, removePizzaFromCart, setPizzaCountInCart } from "./utils";

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItemType[]>([]);
	const [storageScope, setStorageScope] = useState(getStorageScope());
	const [isCartReady, setIsCartReady] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function syncScopeFromSession() {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!isMounted) return;
			setStorageScope(getStorageScope(user?.id));
			setIsCartReady(true);
		}

		syncScopeFromSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setStorageScope(getStorageScope(session?.user?.id));
			setIsCartReady(true);
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (!isCartReady) return;

		const storedCartItems = readStorageJson<CartItemType[]>(
			getCartStorageKey(storageScope),
			[],
		);
		setCartItems(storedCartItems);
	}, [storageScope, isCartReady]);

	useEffect(() => {
		if (!isCartReady) return;
		writeStorageJson(getCartStorageKey(storageScope), cartItems);
	}, [cartItems, storageScope, isCartReady]);

	const addPizzaToCart = (
		pizza: PizzaDataType,
		options: Partial<Omit<CartItemType, "pizza" | "count">> = {},
	) => {
		setCartItems((prev) => addPizza(prev, pizza, options));
	};

	const setPizzaCount = (pizza: PizzaDataType, count: number) => {
		setCartItems((prev) => setPizzaCountInCart(prev, pizza, count));
	};

	const removePizza = (pizza: PizzaDataType) => {
		setCartItems((prev) => removePizzaFromCart(prev, pizza));
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const totalPrice = useMemo(
		() =>
			cartItems.reduce(
				(sum, item) =>
					sum + (item.pizza.price + (item.addsPrice ?? 0)) * item.count,
				0,
			),
		[cartItems],
	);

	const tax = useMemo(() => Math.round(totalPrice * 0.05), [totalPrice]);

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addPizzaToCart,
				setPizzaCount,
				removePizza,
				clearCart,
				totalPrice,
				tax,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
