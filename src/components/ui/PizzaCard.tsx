import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { PizzaDataType } from "../../data/data";
import {
	detectTags,
	getLocalizedAddName,
	getLocalizedIngredients,
	getLocalizedPizzaName,
	plus,
} from "../../data/data";
import { Translate } from "../translate/Translate";
import Counter from "./Counter";
import Line from "./Line";

export type PizzaCardVariant = "main" | "cart" | "checkout";

interface PizzaCardProps {
	pizza: PizzaDataType;
	img?: string;
	count: number;
	setCount?: (count: number) => void;
	adds?: string[] | null;
	addsPrice?: number;
	size?: string | null;
	crust?: string | null;
	openToppingsModal?: (pizza: PizzaDataType) => void;
	onChangeCount?: (pizza: PizzaDataType, count: number) => void;
	onRemove?: (pizza: PizzaDataType) => void;
	variant?: PizzaCardVariant;
}

export default function PizzaCard({
	pizza,
	img,
	count,
	setCount,
	adds,
	addsPrice,
	size,
	crust,
	openToppingsModal,
	onChangeCount,
	onRemove,
	variant = "main",
}: PizzaCardProps) {
	const { lang, t } = useLanguage();
	const [imgLoaded, setImgLoaded] = useState(false);
	const tags = detectTags(pizza.pizzaCategory);
	const localizedName = getLocalizedPizzaName(pizza.name, lang);
	const localizedIngredients = getLocalizedIngredients(pizza.ingredients, lang);
	const localizedSize = size ? t(size) : "";
	const localizedCrust = crust ? t(crust) : "";

	// ─── MAIN PAGE CARD ──────────────────────────────────────────────────────────
	if (variant === "main") {
		return (
			<div className="border border-[var(--gray-dark)] rounded-2xl app-surface shadow-sm hover:bg-[var(--orange-soft)] transition-colors duration-200 flex flex-col overflow-hidden w-full">
				{/* Image area */}
				<div className="relative w-full h-[220px] app-surface-soft flex items-center justify-center overflow-hidden">
					{/* Shimmer skeleton until image loads */}
					{!imgLoaded && <div className="absolute inset-0 skeleton" />}

					{/* Tag badges */}
					{tags.length > 0 && (
						<div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
							{tags.map((tag) => (
								<img
									key={tag.key}
									src={tag.img}
									alt={tag.key}
									className={`w-${tag.width} h-${tag.height}`}
								/>
							))}
						</div>
					)}

					<img
						src={img ?? pizza.img}
						alt={localizedName}
						onLoad={() => setImgLoaded(true)}
						loading="lazy"
						decoding="async"
						className={`w-[200px] h-[200px] object-contain transition-opacity duration-500 ${
							imgLoaded ? "opacity-100" : "opacity-0"
						}`}
						style={{ clipPath: "circle(50% at 50% 50%)" }}
					/>
				</div>

				{/* Card body */}
				<div className="p-4 flex flex-col gap-2 flex-1">
					<h3 className="font-bold text-[1.2rem] leading-tight">
						{localizedName}
					</h3>
					<p className="text-[0.8rem] app-muted line-clamp-2 flex-1 leading-relaxed">
						{localizedIngredients}
					</p>

					<div className="flex justify-between items-center mt-1">
						<span className="text-xl font-black text-[var(--orange)]">
							{pizza.price} $
						</span>
						<div>
							{count === 0 ? (
								<button
									className="flex items-center gap-1.5 bg-[var(--orange-light)] text-[var(--orange)] font-semibold px-4 py-1.5 rounded-lg text-md hover:brightness-95 transition active:scale-95"
									onClick={() => openToppingsModal?.(pizza)}
								>
									<img src={plus} alt="" className="w-3.5 h-3.5" />
									<Translate>Add</Translate>
								</button>
							) : (
								<Counter count={count} setCount={setCount!} />
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// ─── CART CARD ───────────────────────────────────────────────────────────────
	if (variant === "cart") {
		const pricePerItem = pizza.price + (addsPrice ?? 0);
		return (
			<div className="w-full grid grid-cols-5 grid-rows-2 gap-2 bg-[var(--gray)] p-3 rounded-xl">
				<img
					src={pizza.img}
					alt={localizedName}
					loading="lazy"
					decoding="async"
					className="row-start-1 col-start-1 w-full h-full object-contain"
				/>
				<div className="row-start-1 col-start-2 col-span-4">
					<p className="font-semibold truncate text-base">{localizedName}</p>
					<p className="text-xs app-muted mb-1">
						{localizedSize}, {localizedCrust},{" "}
						<Translate>
							{pizza.pizzaType === "new" ? "New" : "Classic"}
						</Translate>
						{adds &&
							adds.length > 0 &&
							`, + ${adds.map((add) => getLocalizedAddName(add, lang)).join(", ")}`}
					</p>
					<Line width="w-full" />
				</div>
				<div className="row-start-2 col-start-2 col-span-4 flex items-center justify-between gap-2">
					<Counter count={count} setCount={(n) => onChangeCount?.(pizza, n)} />
					<span className="text-sm app-muted">
						{pricePerItem} $ <Translate>each</Translate>
					</span>
				</div>
			</div>
		);
	}

	// ─── CHECKOUT CARD ───────────────────────────────────────────────────────────
	if (variant === "checkout") {
		const pricePerItem = pizza.price + (addsPrice ?? 0);
		const totalItemPrice = pricePerItem * count;

		return (
			<div className="flex items-center justify-between py-5 px-2 border-b last:border-none gap-2">
				<div className="flex items-center gap-3 w-[55%] min-w-0">
					<img
						src={pizza.img}
						alt={localizedName}
						loading="lazy"
						decoding="async"
						className="w-[64px] h-[64px] object-contain shrink-0"
					/>
					<div className="flex flex-col min-w-0">
						<p className="font-semibold text-base truncate">{localizedName}</p>
						<p className="app-muted text-xs truncate">
							{localizedSize && `${localizedSize}`}
							{localizedCrust && `, ${localizedCrust}`}
						</p>
						{adds && adds.length > 0 && (
							<p className="app-muted text-xs truncate">
								+ {adds.map((add) => getLocalizedAddName(add, lang)).join(", ")}
							</p>
						)}
					</div>
				</div>

				<span className="font-bold text-base whitespace-nowrap">
					{totalItemPrice} $
				</span>

				<Counter count={count} setCount={(n) => onChangeCount?.(pizza, n)} />

				<button
					onClick={() => onRemove?.(pizza)}
					className="app-muted hover:text-[var(--text-main)] text-3xl leading-none transition ml-1"
					aria-label="Remove item"
				>
					×
				</button>
			</div>
		);
	}

	return null;
}
