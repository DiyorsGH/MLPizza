import { Link } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import {
  logo,
  login,
  cart,
  searchIcon,
} from "../../data/data";

interface HeaderProps {
  overallAmount: number;
  isSearchOpen: boolean;
  headerSearchQuery: string;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  setHeaderSearchQuery: Dispatch<SetStateAction<string>>;
  setIsCartModalOpen: Dispatch<SetStateAction<boolean>>;
    filteredPizzas: {   
    name: string;
    price: number;
    img: string;
  }[];
}


export default function Header({
  overallAmount,
  isSearchOpen,
  headerSearchQuery,
  setIsSearchOpen,
  setHeaderSearchQuery,
  setIsCartModalOpen,
  filteredPizzas
}: HeaderProps) {
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

      <header className="header h-[10vh] w-full fixed top-0 left-0 border-b-2 border-[var(--gray)] flex justify-between items-center px-4 bg-white z-[20]">
        <img src={logo} alt="Logo" className="scale-[1.05]" />
        <div className="w-[20%] h-[65%] flex justify-end gap-4">
            <button className="border-2 border-[var(--orange)] rounded-xl w-[45%] h-full flex items-center justify-center gap-2 text-[var(--orange)] font-medium text-big">
              <img src={login} alt="Login" className="w-5 h-5" />
              Login
            </button>

          {overallAmount > 0 ? (
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="border-2 border-[var(--orange)] rounded-xl w-[40%] h-full flex items-center justify-center gap-2 text-[var(--orange)] font-medium text-big transition-all duration-300 ease-in-out will-change-[width]"
            >
              <p>{overallAmount}</p>
              <div className="h-[70%] w-[2px] bg-[var(--orange)] rounded-xl relative"></div>
              <img src={cart} alt="Cart" className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="border-2 border-[var(--orange)] rounded-xl w-[20%] h-full flex items-center justify-center gap-auto text-[var(--orange)] font-medium text-big transition-all duration-300 ease-in-out will-change-[width]"
            >
              <img src={cart} alt="Cart" className="w-5 h-5" />
            </button>
          )}
        </div>

        
      </header>
      {/* Search input */}
        <div className="headerSearch relative">
                <img src={searchIcon} className="searchIcon" />
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(undefined, { close: true });
                  }}
                  placeholder="Search pizza..."
                  className={`w-full h-full pl-12 rounded-xl text-[var(--gray)] placeholder:text-medium text-medium focus:outline-none transition ${
                    isSearchOpen ? "bg-white shadow-md" : "bg-[var(--gray)]"
                  }`}
                />
                {isSearchOpen && headerSearchQuery.trim() && (
                  <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl p-2 mt-6 z-[60] max-h-[24rem] overflow-y-auto text-medium">
                    {filteredPizzas.length === 0 ? (
                      <div className="text-black p-2">No results</div>
                    ) : (
                      filteredPizzas.map((pizza) => (
                        <div
                          key={pizza.name}
                          onClick={() => handleSearch(pizza.name, { close: true })}
                          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                          <img
                            src={pizza.img}
                            alt={pizza.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
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
    </>
  );
}