import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { PizzaDataType } from "../../data/data";
import {
	addsData,
	getLocalizedIngredients,
	getLocalizedPizzaName,
} from "../../data/data";
import useDialogAnim from "../../hooks/useDialogAnim";
import { Translate } from "../translate/Translate";
import Button from "../ui/Button";
import Segmentbar from "../ui/Segmentbar";
import Title from "../ui/Title";
import ToppingsAdds from "./ToppingsAdds";

type ToppingsModalProps = {
	onClose: () => void;
	pizza: PizzaDataType;
	onConfirm?: (payload: {
		adds: string[];
		size: string | null | undefined;
		crust: string | null | undefined;
		addsPrice: number;
	}) => void;
};

export default function ToppingsModal({
	onClose,
	pizza,
	onConfirm,
}: ToppingsModalProps) {
	const { lang } = useLanguage();
	const dialogRef = useRef<HTMLDialogElement>(null);

	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedCrust, setSelectedCrust] = useState<string | null>(null);
	const [selectedAdds, setSelectedAdds] = useState<string[]>([]);

	const localizedPizzaName = getLocalizedPizzaName(pizza.name, lang);

	const pizzaSizes = ["Small", "Medium", "Large"];
	const doughTypes = ["Thin Crust", "Traditional"];

	useEffect(() => {
		if (!selectedSize) setSelectedSize(pizzaSizes[0]);
		if (!selectedCrust) setSelectedCrust(doughTypes[0]);
	}, []);

	const toggleAdd = (id: string) => {
		setSelectedAdds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const addOnsPrice = selectedAdds.reduce((sum, id) => {
		const add = addsData.find((a) => a.name === id);
		if (!add) return sum;

		const num = Number(add.price.replace(/[^0-9.-]+/g, ""));
		return sum + (isNaN(num) ? 0 : num);
	}, 0);

	const totalPrice = pizza.price + addOnsPrice;

	const closeDialog = useDialogAnim(dialogRef, onClose, {
		appear: "toppingsModalAppear",
		disappear: "toppingsModalDisappear",
		duration: 300,
	});

	const handleConfirm = () => {
		onConfirm?.({
			adds: selectedAdds,
			size: selectedSize,
			crust: selectedCrust,
			addsPrice: addOnsPrice,
		});
		closeDialog();
	};

	return (
		<dialog
			ref={dialogRef}
			className="w-screen h-[100dvh] md:w-[75vw] md:h-[70vh] fixed p-0 z-[60] rounded-2xl"
		>
			<div
				data-modal-container
				className="flex flex-col md:flex-row w-full h-full app-surface md:rounded-2xl overflow-hidden"
			>
				{/* Desktop image */}
				<div className="hidden md:flex md:w-1/2 items-center justify-center app-surface-soft p-6">
					<img
						src={pizza.img || ""}
						alt={pizza.name}
						loading="eager"
						decoding="async"
						className={`absolute w-full max-w-[320px] object-cover ${
							selectedSize === "Medium"
								? "scale-100"
								: selectedSize === "Small"
								? "scale-75"
								: "scale-125"
						} transition duration-300`}
						style={{ clipPath: "circle(50% at center)" }}
					/>
				</div>

				{/* Content */}
				<div className="flex-1 flex flex-col gap-5 md:gap-4 bg-[var(--gray)] p-5 md:p-6 overflow-y-auto round-scrollbar">
					{/* Mobile header */}
					<div className="flex items-center gap-4 md:hidden">
						<img
							src={pizza.img || ""}
							alt={localizedPizzaName}
							decoding="async"
							className="w-24 h-24 object-contain"
						/>
						<Title
							titleContent={localizedPizzaName}
							bold="font-bold"
							fontSize="text-2xl"
						/>
					</div>

					{/* Desktop title */}
					<div className="hidden md:block">
						<Title
							titleContent={localizedPizzaName}
							bold="font-bold"
							fontSize="text-large"
						/>
						<p className="app-muted text-sm mt-1 line-clamp-2">
							{getLocalizedIngredients(pizza.ingredients, lang)}
						</p>
					</div>

					{/* Sizes */}
					<Segmentbar
						elems={pizzaSizes}
						width="w-full"
						height="h-14 md:h-12"
						onSelect={(i) => setSelectedSize(pizzaSizes[i])}
						shape="pill"
					/>

					{/* Dough */}
					<Segmentbar
						elems={doughTypes}
						width="w-full"
						height="h-14 md:h-12"
						onSelect={(i) => setSelectedCrust(doughTypes[i])}
						shape="pill"
					/>

					{/* Toppings */}
					<div>
						<Title
							titleContent="Toppings"
							bold="font-semibold"
							fontSize="text-2xl"
							margin="mb-2"
						/>
						<div className="flex gap-3 overflow-x-auto pb-2 snap-x">
							{addsData.map((add) => (
								<ToppingsAdds
									key={add.name}
									id={add.name}
									image={add.image}
									name={add.name}
									price={add.price}
									selected={selectedAdds.includes(add.name)}
									onToggle={toggleAdd}
								/>
							))}
						</div>
					</div>

					{/* Confirm button */}
					<Button className="h-14 md:h-12 text-base md:text-sm" onClick={handleConfirm}>
						<Translate>Add to cart</Translate> — {totalPrice} $
					</Button>
				</div>

				{/* Close */}
				<button
					onClick={closeDialog}
					className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--surface)]/90 app-muted hover:text-[var(--text-main)] text-xl transition shadow-sm"
					aria-label="Close"
				>
					×
				</button>
			</div>
		</dialog>
	);
}