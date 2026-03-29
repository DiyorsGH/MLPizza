import type { Dispatch, SetStateAction } from "react";
import { Translate } from "../translate/Translate";
import Button from "../ui/Button";
import Line from "../ui/Line";
import Title from "../ui/Title";
import SidebarCheckbox from "./SidebarCheckbox";
import SidebarPriceInput from "./SidebarPriceInput";

type SidebarProps = {
	priceFrom: string;
	priceTo: string;
	setPriceFrom: (val: string) => void;
	setPriceTo: (val: string) => void;
	selectedIngredients: string[];
	setSelectedIngredients: Dispatch<SetStateAction<string[]>>;
	selectedPizzaTypes: string[];
	setSelectedPizzaTypes: Dispatch<SetStateAction<string[]>>;
	resetFilters: () => void;
	sidebarIngredients: string[];
	/** Mobile: is the drawer open? */
	isOpen: boolean;
	onClose: () => void;
};

export default function Sidebar({
	priceFrom,
	priceTo,
	setPriceFrom,
	setPriceTo,
	selectedIngredients,
	setSelectedIngredients,
	selectedPizzaTypes,
	setSelectedPizzaTypes,
	resetFilters,
	sidebarIngredients,
	isOpen,
	onClose,
}: SidebarProps) {
	const handleIngredientChange = (checked: boolean, ingredient: string) => {
		setSelectedIngredients((prev) =>
			checked
				? [...prev, ingredient.toLowerCase()]
				: prev.filter((i) => i !== ingredient.toLowerCase()),
		);
	};

	const handlePizzaTypeChange = (checked: boolean, pizzaType: string) => {
		setSelectedPizzaTypes((prev) =>
			checked
				? [...prev, pizzaType.toLowerCase()]
				: prev.filter((t) => t !== pizzaType.toLowerCase()),
		);
	};

	const handleReset = () => {
		resetFilters();
		onClose();
	};

	return (
		<>
			{/* Mobile backdrop */}
			<div
				className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300 ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			/>

			{/* Sidebar panel */}
			<aside
				className={`
                    fixed top-0 bottom-0 left-0 w-72 shrink-0
                    app-surface border-r border-[var(--gray-dark)] z-40
                    transition-transform duration-300 ease-in-out
                    lg:relative lg:top-auto lg:bottom-auto lg:z-auto lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
			>
				{/* Mobile header */}
				<div className="flex items-center justify-between p-4 pb-0 lg:hidden">
					<Title titleContent="Filters" fontSize="text-2xl" bold="font-bold" />
					<button
						onClick={onClose}
						className="app-muted hover:text-[var(--text-main)] text-2xl leading-none"
						aria-label="Close filters"
					>
						×
					</button>
				</div>

				<div className="px-[2vw] py-4">
					{/* Desktop title */}
					<Title
						titleContent="Filters"
						fontSize="text-2xl"
						bold="font-bold"
						margin="mb-3 hidden lg:block"
					/>

					{/* Pizza type */}
					<Title
						titleContent="Pizza type"
						fontSize="text-base"
						bold="font-semibold"
						margin="mb-2 mt-2 lg:mt-0"
					/>
					<SidebarCheckbox
						text="New"
						checked={selectedPizzaTypes.includes("new")}
						onCheckChange={handlePizzaTypeChange}
					/>
					<SidebarCheckbox
						text="Classic"
						checked={selectedPizzaTypes.includes("classic")}
						onCheckChange={handlePizzaTypeChange}
					/>

					<Line width="w-full" margin="my-4" />

					{/* Price range */}
					<Title
						titleContent="Price range"
						fontSize="text-base"
						bold="font-semibold"
						margin="mb-2"
					/>
					<div className="flex gap-3">
						<SidebarPriceInput
							currency="$"
							value={priceFrom}
							onChange={setPriceFrom}
						/>
						<SidebarPriceInput
							currency="$"
							value={priceTo}
							onChange={setPriceTo}
						/>
					</div>
					<p className="text-xs app-muted mt-1">
						<Translate>Filters apply instantly</Translate>
					</p>

					<Line width="w-full" margin="my-4" />

					{/* Ingredients */}
					<Title
						titleContent="Ingredients"
						fontSize="text-base"
						bold="font-semibold"
						margin="mb-2"
					/>
					<ul>
						{sidebarIngredients.map((ingredient) => (
							<SidebarCheckbox
								key={ingredient}
								text={ingredient}
								checked={selectedIngredients.includes(ingredient.toLowerCase())}
								onCheckChange={handleIngredientChange}
							/>
						))}
					</ul>

					<Button onClick={handleReset} margin="mt-4">
						<Translate>Reset filters</Translate>
					</Button>
				</div>
			</aside>
		</>
	);
}
