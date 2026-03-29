import { useCallback, useMemo, useState } from "react";
import CartModal from "../components/cart/CartModal";
import CategoryBar from "../components/filters/CategoryBar";
import Header from "../components/header/Header";
import FilterSidebar from "../components/sidebar/Sidebar";
import ToppingsModal from "../components/toppings/ToppingsModal";
import { Translate } from "../components/translate/Translate";
import PizzaCard from "../components/ui/PizzaCard";
import type { PizzaDataType } from "../data/data";
import { sidebarListItemsText } from "../data/data";
import { useCart } from "../hooks/useCart";
import usePizzaFilters from "../hooks/usePizzaFilters";

export default function MainPage() {
	const {
		headerSearchQuery,
		setHeaderSearchQuery,
		priceFrom,
		setPriceFrom,
		priceTo,
		setPriceTo,
		selectedIngredients,
		setSelectedIngredients,
		selectedPizzaTypes,
		setSelectedPizzaTypes,
		filteredPizzas,
		resetFilters,
		activeSegment,
		setActiveSegment,
		segments,
		activeSort,
		setActiveSort,
		sortOptions,
		activeFilterCount,
	} = usePizzaFilters();

	const { cartItems, addPizzaToCart, setPizzaCount, totalPrice, tax } =
		useCart();

	const [selectedPizza, setSelectedPizza] = useState<PizzaDataType | null>(
		null,
	);
	const [isToppingsModalOpen, setIsToppingsModalOpen] = useState(false);
	const [isCartModalOpen, setIsCartModalOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const openToppingsModal = useCallback((pizza: PizzaDataType) => {
		setSelectedPizza(pizza);
		setIsToppingsModalOpen(true);
	}, []);

	const overallAmount = useMemo(
		() => cartItems.reduce((sum, i) => sum + i.count, 0),
		[cartItems],
	);

	return (
		<div className="h-screen flex flex-col overflow-hidden app-shell">
			{/* ── Header ── */}
			<Header
				overallAmount={overallAmount}
				headerSearchQuery={headerSearchQuery}
				setHeaderSearchQuery={setHeaderSearchQuery}
				setIsCartModalOpen={setIsCartModalOpen}
				filteredPizzas={filteredPizzas}
			/>

			{/* ── Category bar ── */}
			<CategoryBar
				segments={segments}
				activeSegment={activeSegment}
				setActiveSegment={setActiveSegment}
				activeSort={activeSort}
				setActiveSort={setActiveSort}
				sortOptions={sortOptions}
				activeFilterCount={activeFilterCount}
				onFilterClick={() => setIsSidebarOpen(true)}
			/>

			{/* ── Content row ── */}
			<div className="flex flex-1 min-h-0">
				{/* Sidebar — always visible on lg+, drawer on smaller */}
				<FilterSidebar
					priceFrom={priceFrom}
					priceTo={priceTo}
					setPriceFrom={setPriceFrom}
					setPriceTo={setPriceTo}
					selectedIngredients={selectedIngredients}
					setSelectedIngredients={setSelectedIngredients}
					selectedPizzaTypes={selectedPizzaTypes}
					setSelectedPizzaTypes={setSelectedPizzaTypes}
					resetFilters={resetFilters}
					sidebarIngredients={sidebarListItemsText}
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>

				{/* Pizza grid */}
				<main className="flex-1 overflow-y-auto p-4 round-scrollbar">
					{filteredPizzas.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full gap-3 app-muted">
							<span className="text-6xl select-none">🍕</span>
							<p className="text-lg font-semibold">
								<Translate>No pizzas found</Translate>
							</p>
							<p className="text-sm">
								<Translate>Try adjusting your filters</Translate>
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
							{filteredPizzas.map((pizza) => {
								const cartEntry = cartItems.find(
									(i) => i.pizza.name === pizza.name,
								);
								const count = cartEntry ? cartEntry.count : 0;

								return (
									<PizzaCard
										key={pizza.name}
										pizza={pizza}
										count={count}
										setCount={(c) => setPizzaCount(pizza, c)}
										openToppingsModal={openToppingsModal}
										variant="main"
									/>
								);
							})}
						</div>
					)}
				</main>
			</div>

			{/* ── Toppings modal ── */}
			{isToppingsModalOpen && selectedPizza && (
				<ToppingsModal
					pizza={selectedPizza}
					onClose={() => {
						setIsToppingsModalOpen(false);
						setSelectedPizza(null);
					}}
					onConfirm={(payload) => {
						addPizzaToCart(selectedPizza, {
							adds: payload.adds,
							size: payload.size ?? undefined,
							crust: payload.crust ?? undefined,
							addsPrice: payload.addsPrice,
						});
					}}
				/>
			)}

			{/* ── Cart modal ── */}
			{isCartModalOpen && (
				<CartModal
					cartItems={cartItems}
					onChangeCount={setPizzaCount}
					onClose={() => setIsCartModalOpen(false)}
					overallAmount={overallAmount}
					totalPrice={totalPrice}
					tax={tax}
				/>
			)}
		</div>
	);
}
