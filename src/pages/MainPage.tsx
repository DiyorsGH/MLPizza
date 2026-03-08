import { useState, useEffect } from "react";
import MainItem from "../components/MainSection/MainItem";
import Segmentbar from "../components/Categories/Segmentbar";
import FilterSidebar from "../components/Sidebar/FilterSidebar";
import ToppingsModal from "../components/ToppingsModal/ToppingsModal";
import CartModal from "../components/CartModal/CartModal";
import usePizzaFilters from "../hooks/usePizzaFilters";
import Header from "../components/Header/Header";

import {
  sort,
  sidebarListItemsText,
} from "../data/data";

import type { PizzaDataType } from "../data/data";

export default function MainPage() {
  const {
    headerSearchQuery,
    setHeaderSearchQuery,
    draftPriceFrom,
    setDraftPriceFrom,
    draftPriceTo,
    setDraftPriceTo,
    draftSelectedIngredients,
    setDraftSelectedIngredients,
    draftSelectedPizzaTypes,
    setDraftSelectedPizzaTypes,
    filteredPizzas,
    submitFilters,
    resetFilters,
    activeSegment,
    setActiveSegment,
    segments,
    activeSort,
    setActiveSort,
    sortOptions,
  } = usePizzaFilters();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<PizzaDataType | null>(
    null
  );
  const [isToppingsModalOpen, setIsToppingsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const [cartItems, setCartItems] = useState<
    {
      pizza: PizzaDataType;
      count: number;
      size: string | null;
      crust: string | null;
      adds: string[] | null;
      addsPrice: number;
    }[]
  >([]);

  const openToppingsModal = (pizza: PizzaDataType) => {
    setSelectedPizza(pizza);
    setIsToppingsModalOpen(true);
  };

  const addPizzaToCart = (
    pizza: PizzaDataType,
    payload: {
      size?: string | null;
      crust?: string | null;
      adds?: string[] | null;
      addsPrice?: number;
    }
  ) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.pizza.name === pizza.name);

      if (idx !== -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          count: next[idx].count + 1,
        };
        return next;
      }

      return [
        ...prev,
        {
          pizza,
          count: 1,
          size: payload.size ?? null,
          crust: payload.crust ?? null,
          adds: payload.adds ?? null,
          addsPrice: payload.addsPrice ?? 0,
        },
      ];
    });
  };

  const setPizzaCount = (pizza: PizzaDataType, newCount: number) => {
    setCartItems((prev: any) => {
      if (newCount <= 0)
        return prev.filter((i: any) => i.pizza.name !== pizza.name);
      const idx = prev.findIndex((i: any) => i.pizza.name === pizza.name);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], count: newCount };
        return next;
      }
      return [...prev, { pizza, count: newCount }];
    });
  };

  const overallAmount = cartItems.reduce((sum, i) => sum + i.count, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const base = item.pizza.price;
    const adds = item.addsPrice ?? 0;
    return sum + (base + adds) * item.count;
  }, 0);

  useEffect(() => {
    console.log("overall amount:", overallAmount);
  }, [overallAmount]);


  return (
    <>
      {/* Search overlay */}
      <Header
  overallAmount={overallAmount}
  isSearchOpen={isSearchOpen}
  headerSearchQuery={headerSearchQuery}
  setIsSearchOpen={setIsSearchOpen}
  setHeaderSearchQuery={setHeaderSearchQuery}
  setIsCartModalOpen={setIsCartModalOpen}
  filteredPizzas={filteredPizzas} // <-- pass this prop
/>

      
      

      {/* Segmentbar & Sort */}
      <div className="h-[8vh] w-[80vw] fixed top-[10vh] right-0 px-2 pr-4 border-b-2 border-[var(--gray)] flex items-center justify-between z-[20]">
        <Segmentbar
          elems={segments}
          selectedIndex={activeSegment}
          onSelect={(i) => setActiveSegment(i)}
          width="w-[65%]"
          height="h-[80%]"
        />
        <div className="w-[25%] h-[80%] bg-[var(--gray)] rounded-xl flex items-center justify-center gap-2 px-2">
          <img src={sort} className="w-5 h-5" />
          <p className="text-[1.1rem] mr-1">Sort by:</p>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(Number(e.target.value))}
            className="bg-transparent appearance-none outline-none text-[var(--orange)] cursor-pointer text-[1.1rem]"
          >
            {sortOptions.map((sortOption, index) => (
              <option key={sortOption} value={index}>
                {sortOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sidebar */}
      <FilterSidebar
        draftPriceFrom={draftPriceFrom}
        draftPriceTo={draftPriceTo}
        setDraftPriceFrom={setDraftPriceFrom}
        setDraftPriceTo={setDraftPriceTo}
        draftSelectedIngredients={draftSelectedIngredients}
        setDraftSelectedIngredients={setDraftSelectedIngredients}
        draftSelectedPizzaTypes={draftSelectedPizzaTypes}
        setDraftSelectedPizzaTypes={setDraftSelectedPizzaTypes}
        submitFilters={submitFilters}
        resetFilters={resetFilters}
        sidebarIngredients={sidebarListItemsText}
      />

      {/* Main content */}
      <main className="w-[80vw] fixed right-0 top-[18vh] bottom-0 p-2 overflow-y-auto z-[10] hide-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPizzas.map((pizza) => {
            const cartEntry = cartItems.find(
              (i) => i.pizza.name === pizza.name
            );
            const count = cartEntry ? cartEntry.count : 0;
            return (
              <MainItem
                key={pizza.name}
                img={pizza.img}
                name={pizza.name}
                ingredients={pizza.ingredients}
                price={pizza.price}
                pizzaCategory={pizza.pizzaCategory}
                pizzaType={pizza.pizzaType}
                purchase={pizza.purchase}
                openToppingsModal={openToppingsModal}
                count={count}
                setCount={(c) => setPizzaCount(pizza, c)}
              />
            );
          })}
        </div>
      </main>

      {/* Modals */}
      {isToppingsModalOpen && selectedPizza && (
        <ToppingsModal
          pizza={selectedPizza}
          onClose={() => {
            setIsToppingsModalOpen(false);
            setSelectedPizza(null);
          }}
          onConfirm={(payload) => {
            if (selectedPizza) addPizzaToCart(selectedPizza, payload);
          }}
        />
      )}
      {isCartModalOpen && (
        <CartModal
          cartItems={cartItems}
          onChangeCount={(pizza, count) => setPizzaCount(pizza, count)}
          onClose={() => setIsCartModalOpen(false)}
          overallAmount={overallAmount}
          totalPrice={totalPrice}
        />
      )}
    </>
  );
}