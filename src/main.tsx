import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import "./styles/main.css";
import MainItem from "./components/MainItem";
import Segmentbar from "./components/Segmentbar";
import FilterSidebar from "./components/FilterSidebar";
import ToppingsModal from "./components/ToppingsModal";
import CartModal from "./components/CartModal";
import usePizzaFilters from "./usePizzaFilters";
import { logo, searchIcon, login, cart, sort, sidebarListItemsText} from "./data";
import type { PizzaDataType } from "./data"

function App() {
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

        const [selectedPizza, setSelectedPizza] = useState<PizzaDataType | null>(null)
        const [isToppingsModalOpen, setIsToppingsModalOpen] = useState(false)

        const [isCartModalOpen, setIsCartModalOpen] = useState(false)

        // cart items track pizza + quantity
        const [cartItems, setCartItems] = useState<{
            pizza: PizzaDataType
            count: number
        }[]>([])

        const openToppingsModal = (pizza: PizzaDataType) => {
                setSelectedPizza(pizza)
                setIsToppingsModalOpen(true)
        }

        const addPizzaToCart = (pizza: PizzaDataType) => {
            setCartItems(prev => {
                const idx = prev.findIndex(i => i.pizza.name === pizza.name)
                if (idx !== -1) {
                    const next = [...prev]
                    next[idx] = { ...next[idx], count: next[idx].count + 1 }
                    return next
                }
                return [...prev, { pizza, count: 1 }]
            })
        }

        const setPizzaCount = (pizza: PizzaDataType, newCount: number) => {
            setCartItems(prev => {
                if (newCount <= 0) return prev.filter(i => i.pizza.name !== pizza.name)
                const idx = prev.findIndex(i => i.pizza.name === pizza.name)
                if (idx !== -1) {
                    const next = [...prev]
                    next[idx] = { ...next[idx], count: newCount }
                    return next
                }
                return [...prev, { pizza, count: newCount }]
            })
        }

        // log overall amount whenever cart changes
        const overallAmount = cartItems.reduce((sum, i) => sum + i.count, 0)
        useEffect(() => {
            console.log("overall amount:", overallAmount)
        }, [overallAmount])

    const handleSearch = (value?: string, options?: { close?: boolean }) => {
        if (value !== undefined) setHeaderSearchQuery(value);
        if (options?.close) setIsSearchOpen(false);
        else setIsSearchOpen((value ?? headerSearchQuery).trim().length > 0);
    };

    return (
        <>
        {isSearchOpen && (
            <div
            className="fixed inset-0 bg-black/30 z-[30]"
            onClick={() => handleSearch(undefined, { close: true })}
            />
        )}

        {/* Header */}
        <header className="header h-[10vh] w-full fixed top-0 left-0 border-b-2 border-[var(--gray)] flex justify-between items-center px-4 bg-white z-[20]">
            <img src={logo} alt="Logo" className="scale-[1.05]" />
            <div className="w-[20%] h-[65%] flex justify-end gap-4">
                <button
                    className="border-2 border-[var(--orange)] rounded-xl w-[45%] h-full flex items-center justify-center gap-2 text-[var(--orange)] font-medium text-[1.2rem]"
                >
                        <img src={login} alt="Login" className="w-5 h-5" />
                        Login
                </button>
                        {overallAmount > 0 ? (
                            <button
                                onClick={() => setIsCartModalOpen(true)}
                                className="border-2 border-[var(--orange)] rounded-xl w-[40%] h-full flex items-center justify-center gap-2 text-[var(--orange)] font-medium text-[1.2rem] transition-all duration-300 ease-in-out will-change-[width]"
                            >
                                <p>{overallAmount}</p>
                                <div className="h-[70%] w-[2px] bg-[var(--orange)] rounded-xl relative"></div>
                                <img src={cart} alt="Cart" className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsCartModalOpen(true)}
                                className="border-2 border-[var(--orange)] rounded-xl w-[20%] h-full flex items-center justify-center gap-auto text-[var(--orange)] font-medium text-[1.2rem] transition-all duration-300 ease-in-out will-change-[width]"
                            >
                                <img src={cart} alt="Cart" className="w-5 h-5" />
                            </button>
                        )}
                
            </div>
        </header>

        {/* Search */}
        <div className="headerSearch relative">
            <img src={searchIcon} className="searchIcon" />
            <input
            type="text"
            value={headerSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(undefined, { close: true }) }}
            placeholder="Search pizza..."
            className={`w-full h-full pl-12 rounded-xl text-black placeholder:text-[1.1rem] text-[1.1rem] focus:outline-none transition ${
                isSearchOpen ? "bg-white shadow-md" : "bg-[var(--gray)]"
            }`}
            />
            {isSearchOpen && headerSearchQuery.trim() && (
            <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl p-2 mt-6 z-[60] max-h-[24rem] overflow-y-auto text-[1.1rem]">
                {filteredPizzas.length === 0 ? (
                <div className="text-black p-2">No results</div>
                ) : (
                filteredPizzas.map(pizza => (
                    <div
                    key={pizza.name}
                    onClick={() => handleSearch(pizza.name, { close: true })}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                    <img src={pizza.img} alt={pizza.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 flex justify-between items-center">
                        <span>{pizza.name}</span>
                        <span>${pizza.price}</span>
                    </div>
                    </div>
                ))
                )}
            </div>
            )}
        </div>

        {/* Segmentbar & Sort */}
        <div className="h-[8vh] w-[80vw] fixed top-[10vh] right-0 px-2 pr-4 border-b-2 border-[var(--gray)] flex items-center justify-between z-[20]">
        <Segmentbar elems={segments} selectedIndex={activeSegment} onSelect={(i) => setActiveSegment(i)} width="w-[65%]" height="h-[80%]"/>
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

        {/* Main */}
        <main className="w-[80vw] fixed right-0 top-[18vh] bottom-0 p-2 overflow-y-auto z-[10]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPizzas.map(pizza => {
                const cartEntry = cartItems.find(i => i.pizza.name === pizza.name)
                const count = cartEntry ? cartEntry.count : 0
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
                )
            })}
            </div>
        </main>
                {isToppingsModalOpen && selectedPizza && (
                <ToppingsModal
                        pizza={selectedPizza}
                        onClose={() => {
                                setIsToppingsModalOpen(false)
                                setSelectedPizza(null)
                        }}
                        onConfirm={(payload) => {
                            console.log('Toppings confirmed payload:', payload)
                            // add one pizza to cart when modal confirms
                            if (selectedPizza) addPizzaToCart(selectedPizza)
                        }}
                />
                )}
        {isCartModalOpen && (
        <CartModal
            cartItems={cartItems}
            onChangeCount={(pizza, count) => setPizzaCount(pizza, count)}
            onClose={() => setIsCartModalOpen(false)}
        />
        )}
        </>
    );
}
// m-before

createRoot(document.getElementById("root")!).render(<App />);