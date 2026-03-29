import { useRef } from "react";
import { Link } from "react-router-dom";
import type { PizzaDataType } from "../../data/data";
import { emptyCart } from "../../data/data";
import useDialogAnim from "../../hooks/useDialogAnim";
import { Translate } from "../translate/Translate";
import Button from "../ui/Button";
import PizzaCard from "../ui/PizzaCard";
import CartModalFooterItems from "./CartPriceRow";

export default function CartModal({
	onClose,
	cartItems,
	onChangeCount,
	overallAmount,
	totalPrice,
	tax,
}: {
	onClose: () => void;
	cartItems: {
		pizza: PizzaDataType;
		count: number;
		size?: string | null;
		crust?: string | null;
		adds?: string[] | null;
		addsPrice: number;
	}[];
	onChangeCount: (pizza: PizzaDataType, newCount: number) => void;
	overallAmount: number;
	totalPrice: number;
	tax: number;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const closeDialog = useDialogAnim(dialogRef, onClose, {
		appear: "cartModalAppear",
		disappear: "cartModalDisappear",
		duration: 300,
	});

	return (
		<dialog
			ref={dialogRef}
			className="fixed left-auto top-0 w-[clamp(30vw,30vw,50vw)] min-w-[300px] h-[100dvh] max-h-none app-surface flex flex-col z-[60] shadow-2xl backdrop:bg-black/30 backdrop:m-0"
		>
			{/* Header */}
			<div className="h-16 shrink-0 flex justify-between items-center px-5 border-b border-[var(--gray-dark)]">
				<p className="text-base font-semibold">
					<span className="font-bold text-lg">{overallAmount}</span>{" "}
					<Translate>{overallAmount === 1 ? "item" : "items"}</Translate>{" "}
					<Translate>in cart</Translate>
				</p>
				<button
					onClick={closeDialog}
					className="closeBtn w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--gray)] transition"
					aria-label="Close cart"
				>
					×
				</button>
			</div>

			{cartItems.length === 0 ? (
				/* Empty state */
				<div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
					<img src={emptyCart} alt="Empty cart" className="w-36 opacity-70" />
					<p className="app-muted font-medium">
						<Translate>Your cart is empty</Translate>
					</p>
					<p className="app-muted text-sm text-center">
						<Translate>Add some delicious pizzas to get started!</Translate>
					</p>
					<div className="w-full">
						<Button onClick={closeDialog}>
							← <Translate>Start Shopping</Translate>
						</Button>
					</div>
				</div>
			) : (
				<>
					{/* Cart items */}
					<div className="flex-1 gap-2 overflow-y-auto px-3 py-2 space-y-2 round-scrollbar">
						{cartItems.map(({ pizza, count, size, crust, adds, addsPrice }) => (
							<PizzaCard
								key={pizza.name}
								pizza={pizza}
								count={count}
								size={size}
								crust={crust}
								adds={adds}
								addsPrice={addsPrice}
								onChangeCount={onChangeCount}
								variant="cart"
							/>
						))}
					</div>

					{/* Footer */}
					<div className="shrink-0 app-surface-strong border-t border-[var(--gray-dark)] p-5 flex flex-col gap-3 justify-between">
						<CartModalFooterItems text="Subtotal" value={totalPrice} />
						<CartModalFooterItems text="Tax 5%" value={tax} />
						<Link to="/checkout" className="block mt-1">
							<Button onClick={closeDialog}>
								<Translate>Checkout</Translate> — {totalPrice + tax} $
							</Button>
						</Link>
					</div>
				</>
			)}
		</dialog>
	);
}
