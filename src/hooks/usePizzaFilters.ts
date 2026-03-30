import { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { PizzaCategoryT } from "../data/data";
import {
	getLocalizedIngredients,
	getLocalizedPizzaName,
	pizzaData,
} from "../data/data";

const SEGMENTS = ["All", "Meat", "Spicy", "Sweet", "Vegetarian", "Chicken"];
const SORT_OPTIONS = ["Popularity", "Price", "Alphabet"];

export default function usePizzaFilters() {
	const { lang } = useLanguage();
	const [headerSearchQuery, setHeaderSearchQuery] = useState("");
	const [priceFrom, setPriceFrom] = useState("");
	const [priceTo, setPriceTo] = useState("");
	const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
	const [selectedPizzaTypes, setSelectedPizzaTypes] = useState<string[]>([]);
	const [activeSegment, setActiveSegment] = useState(0);
	const [activeSort, setActiveSort] = useState(0);

	const segments = SEGMENTS;
	const sortOptions = SORT_OPTIONS;

	const resetFilters = () => {
		setPriceFrom("");
		setPriceTo("");
		setSelectedIngredients([]);
		setSelectedPizzaTypes([]);
		setActiveSegment(0);
	};

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (priceFrom) count++;
		if (priceTo) count++;
		count += selectedIngredients.length;
		count += selectedPizzaTypes.length;
		return count;
	}, [priceFrom, priceTo, selectedIngredients, selectedPizzaTypes]);

	const filteredPizzas = useMemo(() => {
		let result = [...pizzaData];

		if (headerSearchQuery.trim()) {
			const normalizedQuery = headerSearchQuery.trim().toLowerCase();
			result = result.filter((p) => {
				const englishName = p.name.toLowerCase();
				const localizedName = getLocalizedPizzaName(p.name, lang).toLowerCase();
				const englishIngredients = p.ingredients.toLowerCase();
				const localizedIngredients = getLocalizedIngredients(
					p.ingredients,
					lang,
				).toLowerCase();

				return (
					englishName.includes(normalizedQuery) ||
					localizedName.includes(normalizedQuery) ||
					englishIngredients.includes(normalizedQuery) ||
					localizedIngredients.includes(normalizedQuery)
				);
			});
		}

		if (priceFrom) {
			result = result.filter((p) => p.price >= Number(priceFrom));
		}

		if (priceTo) {
			result = result.filter((p) => p.price <= Number(priceTo));
		}

		if (selectedIngredients.length > 0) {
			result = result.filter((p) =>
				selectedIngredients.every((ing) =>
					p.ingredients.toLowerCase().includes(ing.toLowerCase()),
				),
			);
		}

		if (selectedPizzaTypes.length > 0) {
			result = result.filter((p) => selectedPizzaTypes.includes(p.pizzaType));
		}

		const selectedSegment = segments[activeSegment];
		if (selectedSegment !== "All") {
			const seg = selectedSegment.toLowerCase() as PizzaCategoryT;
			result = result.filter((p) => {
				if (!p.pizzaCategory) return false;
				if (Array.isArray(p.pizzaCategory))
					return p.pizzaCategory.includes(seg);
				return p.pizzaCategory === seg;
			});
		}

		const selectedSortLabel = sortOptions[activeSort];
		if (selectedSortLabel === "Price") {
			result.sort((a, b) => a.price - b.price);
		} else if (selectedSortLabel === "Alphabet") {
			result.sort((a, b) =>
				getLocalizedPizzaName(a.name, lang).localeCompare(
					getLocalizedPizzaName(b.name, lang),
				),
			);
		} else {
			result.sort((a, b) => b.purchase - a.purchase);
		}

		return result;
	}, [
		headerSearchQuery,
		priceFrom,
		priceTo,
		selectedIngredients,
		selectedPizzaTypes,
		activeSegment,
		activeSort,
		lang,
	]);

	return {
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
	};
}
