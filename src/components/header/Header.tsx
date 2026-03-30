import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // react-router-dom v6
import { useLanguage } from "../../contexts/LanguageContext";
import type { PizzaDataType } from "../../data/data";
import { cart, getLocalizedPizzaName, searchIcon } from "../../data/data";
import { getCurrentUser, supabase } from "../../lib/supabase";
import ProfileMenu from "../account/ProfileMenu";
import { LangSwitcher } from "../translate/LangSwitcher";
import { Translate } from "../translate/Translate";
import { Logo } from "../ui";

interface HeaderProps {
	overallAmount: number;
	headerSearchQuery: string;
	setHeaderSearchQuery: (q: string) => void;
	setIsCartModalOpen: (open: boolean) => void;
	filteredPizzas: Pick<PizzaDataType, "name" | "price" | "img">[];
}

export default function Header({
	overallAmount,
	headerSearchQuery,
	setHeaderSearchQuery,
	setIsCartModalOpen,
	filteredPizzas,
}: HeaderProps) {
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState<{
		id: string;
		email: string;
		username: string;
	} | null>(null);
	const navigate = useNavigate();
	const { lang, t } = useLanguage();

	const showDropdown = isSearchFocused && headerSearchQuery.trim().length > 0;

	const handleSelect = (name: string) => {
		setHeaderSearchQuery(getLocalizedPizzaName(name, lang));
		setIsSearchFocused(false);
		setIsMobileSearchOpen(false);
	};

	const clearMobileSearch = () => {
		setHeaderSearchQuery("");
		setIsMobileSearchOpen(false);
	};

	// auth
	useEffect(() => {
		async function fetchUser() {
			const user = await getCurrentUser();
			setCurrentUser(user);
		}

		fetchUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			fetchUser();
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<>
			<header className="app-header h-16 shrink-0 border-b border-[var(--gray-dark)] flex justify-between items-center px-[max(16px,2vw)] gap-3 relative">
				<Logo />

				{/* Desktop search */}
				<div className="hidden sm:flex flex-1 mx-2 max-w-md relative">
					<img
						src={searchIcon}
						alt=""
						className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 pointer-events-none"
					/>
					<input
						type="text"
						value={headerSearchQuery}
						onChange={(e) => setHeaderSearchQuery(e.target.value)}
						onFocus={() => setIsSearchFocused(true)}
						onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
						placeholder={t("Search pizza...")}
						className="w-full h-10 app-surface-soft rounded-xl pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:bg-[var(--surface)] transition placeholder:text-[1rem]"
						aria-label={t("Search pizza...")}
					/>

					{showDropdown && (
						<div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden shadow-xl border border-[var(--gray-dark)] app-surface">
							<div className="app-surface max-h-52 overflow-y-auto round-scrollbar">
								{filteredPizzas.length === 0 ? (
									<div className="p-4 app-muted text-[1rem]">
										<Translate>No results found</Translate>
									</div>
								) : (
									filteredPizzas.map((pizza) => (
										<button
											key={pizza.name}
											onMouseDown={() => handleSelect(pizza.name)}
											className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--orange-soft)] focus-visible:bg-[var(--orange-soft)] transition text-left border-b border-[var(--gray)] last:border-0"
										>
											<img
												src={pizza.img}
												className="w-10 h-10 rounded-lg object-contain shrink-0"
												alt={getLocalizedPizzaName(pizza.name, lang)}
												loading="lazy"
												decoding="async"
												width="40"
												height="40"
											/>
											<span className="flex-1 text-sm font-medium">
												{getLocalizedPizzaName(pizza.name, lang)}
											</span>
											<span className="text-sm font-bold text-[var(--orange)] whitespace-nowrap">
												{pizza.price} $
											</span>
										</button>
									))
								)}
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					{/* Mobile search trigger */}
					<button
						className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl app-surface-soft active:scale-95 transition"
						onClick={() => setIsMobileSearchOpen(true)}
						aria-label="Search"
					>
						<img src={searchIcon} alt="" className="w-5 h-5 opacity-60" />
					</button>
					<LangSwitcher></LangSwitcher>
					{/* Login button → navigate to auth page */}
					{/* Auth button */}
					{currentUser ? (
						<ProfileMenu
							username={currentUser.username}
							onLoggedOut={() => setCurrentUser(null)}
						/>
					) : (
						<button
							className="sm:flex items-center gap-2 border-2 border-[var(--orange)] text-[var(--orange)] rounded-xl px-3 h-10 font-semibold text-[1rem] hover:bg-[var(--orange-light)] transition"
							onClick={() => navigate("/auth")}
						>
							<Translate>Login</Translate>
						</button>
					)}
					{/* Cart */}
					<button
						onClick={() => setIsCartModalOpen(true)}
						className="flex items-center gap-2 border-2 border-[var(--orange)] text-[var(--orange)] rounded-xl px-3 h-10 font-semibold text-sm hover:bg-[var(--orange-light)] transition active:scale-95"
						aria-label="Open cart"
					>
						{overallAmount > 0 && (
							<>
								<span className="font-bold">{overallAmount}</span>
								<div className="w-px h-4 bg-[var(--orange)] rounded" />
							</>
						)}
						<img src={cart} alt="" className="w-5 h-5" />
					</button>
				</div>
			</header>

			{/* Mobile search overlay */}
			{isMobileSearchOpen && (
				<div className="fixed inset-0 bg-black/40 z-50 sm:hidden">
					<div
						className="app-surface p-4 shadow-lg"
						role="dialog"
						aria-modal="true"
						aria-label="Search"
					>
						<div className="flex items-center gap-8">
							<div className="relative flex-1">
								<img
									src={searchIcon}
									alt=""
									className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 pointer-events-none"
								/>
								<input
									autoFocus
									type="text"
									value={headerSearchQuery}
									onChange={(e) => setHeaderSearchQuery(e.target.value)}
									placeholder={t("Search pizza...")}
									className="w-full h-11 app-surface-soft rounded-xl pl-10 pr-4 focus:outline-none focus:border-[var(--orange)] text-sm"
									aria-label={t("Search pizza...")}
								/>
							</div>
							<button
								onClick={clearMobileSearch}
								className="text-sm font-semibold text-[var(--orange)] px-2 whitespace-nowrap"
							>
								<Translate>Cancel</Translate>
							</button>
						</div>

						{headerSearchQuery.trim() && (
							<div className="mt-3 app-surface rounded-xl border border-[var(--gray-dark)] max-h-[60vh] overflow-y-auto">
								{filteredPizzas.length === 0 ? (
									<div className="p-4 app-muted text-sm">
										<Translate>No results found</Translate>
									</div>
								) : (
									filteredPizzas.map((pizza) => (
										<button
											key={pizza.name}
											onClick={() => handleSelect(pizza.name)}
											className="w-full flex items-center gap-3 px-3 py-3 hover:bg-[var(--orange-soft)] focus-visible:bg-[var(--orange-soft)] transition text-left border-b border-[var(--gray)] last:border-0"
										>
											<img
												src={pizza.img}
												className="w-10 h-10 rounded-lg object-contain"
												alt={getLocalizedPizzaName(pizza.name, lang)}
												loading="lazy"
												decoding="async"
												width="40"
												height="40"
											/>
											<span className="flex-1 text-sm font-medium">
												{getLocalizedPizzaName(pizza.name, lang)}
											</span>
											<span className="text-sm font-bold text-[var(--orange)]">
												{pizza.price} $
											</span>
										</button>
									))
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
