// CheckoutPage.tsx

import * as csc from "country-state-city";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import calendarIcon from "../assets/images/checkout/calendar.svg";
import clockIcon from "../assets/images/checkout/clock-9.svg";
import flagIcon from "../assets/images/checkout/flag.svg";
import ProfileMenu from "../components/account/ProfileMenu";
import { LangSwitcher } from "../components/translate/LangSwitcher";
import { Translate } from "../components/translate/Translate";
import { Logo } from "../components/ui";
import Button from "../components/ui/Button";
import PizzaCard from "../components/ui/PizzaCard";
import Title from "../components/ui/Title";
import { useLanguage } from "../contexts/LanguageContext";
import { usePreferences } from "../contexts/PreferencesContext";
import { box_icon, delivery_icon, tax_icon, trash_icon } from "../data/data";
import { useCart } from "../hooks/useCart";
import { getCurrentUser } from "../lib/supabase";
import { getDistanceKm } from "../utils/distance";
import { getUserCountry } from "../utils/getUserCountry";
import {
	getOrdersStorageKey,
	getStorageScope,
	readStorageJson,
	writeStorageJson,
} from "../utils/storage";

type Option = { key: string; label: string };
type CityOption = Option & { lat: number; lng: number };
type DeliveryDetails = {
	distanceKm: number;
	price: number;
	etaMinutes: number;
};
type DeliverySource = "city" | "geolocation" | "none";

const PROMOCODES = [
	"A1DISCOUNT",
	"B2SAVE10",
	"C3DEAL",
	"D4OFFER",
	"E5PROMO",
	"F6SALE",
	"G7CODE",
	"H8BONUS",
	"I9GIFT",
	"J10SPECIAL",
];

const RESTAURANT_COORDS = { lat: 39.6542, lng: 66.9597 }; // Samarkand, behind Makon Mall
const BASE_DELIVERY_PRICE = 2;
const PRICE_PER_KM = 1;
const BASE_DELIVERY_TIME_MINUTES = 20;
const DELIVERY_MINUTES_PER_KM = 4;
const REQUIRED_FIELDS = [
	"name",
	"surname",
	"email",
	"phone",
	"country",
	"city",
	"street",
] as const;

function extractDigits(value: string) {
	return value.replace(/\D/g, "");
}

function formatPhoneForCountry(rawValue: string, dialCode: string) {
	const normalizedDialCode = extractDigits(dialCode);
	const digits = extractDigits(rawValue);
	const localDigits = digits.startsWith(normalizedDialCode)
		? digits.slice(normalizedDialCode.length)
		: digits;

	const groups = [2, 3, 2, 2];
	const formattedGroups: string[] = [];
	let cursor = 0;

	groups.forEach((groupSize) => {
		const group = localDigits.slice(cursor, cursor + groupSize);
		if (group) formattedGroups.push(group);
		cursor += groupSize;
	});

	const remaining = localDigits.slice(cursor);
	if (remaining) formattedGroups.push(remaining);

	if (formattedGroups.length === 0) return `+${normalizedDialCode}`;

	const [firstGroup, ...otherGroups] = formattedGroups;
	return `+${normalizedDialCode} (${firstGroup})${otherGroups.length ? ` ${otherGroups.join(" ")}` : ""}`;
}

function formatDeliveryDuration(
	totalMinutes: number,
	t: (text: string) => string,
) {
	if (totalMinutes <= 0) return "";
	if (totalMinutes < 60) return `${totalMinutes} ${t("min")}`;

	const totalHours = Math.round(totalMinutes / 60);
	if (totalHours < 24) {
		return `${totalHours} ${t(totalHours === 1 ? "hour" : "hours")}`;
	}

	const totalDays = Math.round(totalHours / 24);
	return `${totalDays} ${t(totalDays === 1 ? "day" : "days")}`;
}

export default function CheckoutPage() {
	const { t } = useLanguage();
	const { cartItems, setPizzaCount, totalPrice, tax, removePizza } = useCart();
	const [user, setUser] = useState<any>(null);
	const loading = false;
	const [errors, setErrors] = useState<{
		name?: string;
		surname?: string;
		email?: string;
		phone?: string;
		country?: string;
		city?: string;
		street?: string;
	}>({});

	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [promocode, setPromocode] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [street, setStreet] = useState("");
	const [comment, setComment] = useState("");

	const { rememberCheckoutDetails } = usePreferences();

	useEffect(() => {
		if (!rememberCheckoutDetails) return;

		const saved = localStorage.getItem("checkout-details");
		if (!saved) return;

		try {
			const parsed = JSON.parse(saved);

			setName(parsed.name || "");
			setSurname(parsed.surname || "");
			setEmail(parsed.email || "");
			setPhone(parsed.phone || "");
			setCountry(parsed.country || "");
			setCity(parsed.city || "");
			setStreet(parsed.street || "");
			setComment(parsed.comment || "");
		} catch {
			console.warn("Failed to parse saved checkout data");
		}
	}, [rememberCheckoutDetails]);

	if (rememberCheckoutDetails) {
		localStorage.setItem(
			"checkout-details",
			JSON.stringify({
				name,
				surname,
				email: user?.email || email,
				phone,
				country,
				city,
				street,
				comment,
			}),
		);
	}

	// Load current user
	useEffect(() => {
		getCurrentUser().then((u) => {
			setUser(u);
			if (u) setEmail(u.email);
		});
	}, []);

	// Auto-detect user country/city
	useEffect(() => {
		async function detectLocation() {
			const loc = await getUserCountry();
			if (loc) {
				setCountry(loc.country);
				if (loc.city) setCity(loc.city);
			}
		}
		detectLocation();
	}, []);
	const isOnlyLetters = (v: string) => /^[A-Za-z\s]+$/.test(v);
	const isOnlyDigits = (v: string) => /^\d+$/.test(v);

	// Validation helper
	const validateField = (field: string, value: string) => {
		switch (field) {
			case "name":
				if (!value.trim()) return t("Name required");
				if (!isOnlyLetters(value)) return t("Only letters allowed");
				if (value.length < 3) return t("Min 3 letters");
				return "";

			case "surname":
				if (!value.trim()) return t("Surname required");
				if (!isOnlyLetters(value)) return t("Only letters allowed");
				if (value.length < 3) return t("Min 3 letters");
				return "";

			case "phone": {
				const digits = extractDigits(value);
				if (!digits) return t("Phone required");
				if (!isOnlyDigits(digits)) return t("Only numbers allowed");
				if (digits.length < 10 || digits.length > 15) return t("Invalid phone");
				return "";
			}

			default:
				return "";
		}
	};

	const countryOptions: Option[] = useMemo(
		() =>
			csc.Country.getAllCountries().map((c) => ({
				key: c.isoCode,
				label: c.name,
			})),
		[],
	);

	const selectedCountry = useMemo(
		() => (country ? csc.Country.getCountryByCode(country) : undefined),
		[country],
	);

	const currentDialCode = selectedCountry?.phonecode ?? "998";

	const cityOptions: CityOption[] = useMemo(() => {
		if (!country) return [];
		return (csc.City.getCitiesOfCountry(country) ?? []).map((c) => ({
			key: c.name,
			label: c.name,
			lat: Number(c.latitude),
			lng: Number(c.longitude),
		}));
	}, [country]);

	useEffect(() => {
		setPhone((prev) => formatPhoneForCountry(prev, currentDialCode));
	}, [currentDialCode]);

	const renderSelect = (
		value: string,
		onChange: (v: string) => void,
		options: Option[],
		placeholder: string,
		disabled = false,
		error?: string,
	) => (
		<div className="flex flex-col gap-1 relative">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				className={`input w-full p-2 rounded-xl bg-[var(--gray)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)] appearance-none pr-10 ${
					disabled ? "opacity-60 cursor-not-allowed" : ""
				}`}
			>
				<option value="" disabled hidden>
					{placeholder}
				</option>
				{options.map((o) => (
					<option key={o.key} value={o.key}>
						{o.label}
					</option>
				))}
			</select>
			<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 app-muted text-sm">
				▼
			</span>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);

	const selectedCityCoords = useMemo(() => {
		if (!city) return null;
		const matchedCity = cityOptions.find((option) => option.key === city);
		return matchedCity ? { lat: matchedCity.lat, lng: matchedCity.lng } : null;
	}, [city, cityOptions]);

	const deliverySource: DeliverySource = selectedCityCoords ? "city" : "none";

	const deliveryDetails = useMemo<DeliveryDetails>(() => {
		if (totalPrice === 0) {
			return { distanceKm: 0, price: 0, etaMinutes: 0 };
		}

		const sourceCoords = selectedCityCoords;
		if (!sourceCoords) {
			return { distanceKm: 0, price: 0, etaMinutes: 0 };
		}

		const rawDistance = getDistanceKm(
			sourceCoords.lat,
			sourceCoords.lng,
			RESTAURANT_COORDS.lat,
			RESTAURANT_COORDS.lng,
		);
		const distanceKm = Number(rawDistance.toFixed(1));
		const price = Math.max(
			BASE_DELIVERY_PRICE,
			Math.round(BASE_DELIVERY_PRICE + distanceKm * PRICE_PER_KM),
		);
		const etaMinutes = Math.max(
			BASE_DELIVERY_TIME_MINUTES,
			Math.round(
				BASE_DELIVERY_TIME_MINUTES + distanceKm * DELIVERY_MINUTES_PER_KM,
			),
		);

		return { distanceKm, price, etaMinutes };
	}, [selectedCityCoords, totalPrice]);

	useEffect(() => {
		console.log("[checkout] delivery recalculated", {
			country,
			city,
			street,
			source: deliverySource,
			sourceCoords: selectedCityCoords,
			deliveryDetails,
		});
	}, [
		country,
		city,
		street,
		selectedCityCoords,
		deliveryDetails,
		deliverySource,
	]);

	const deliveryPrice = deliveryDetails.price;
	const deliveryDurationLabel = useMemo(
		() => formatDeliveryDuration(deliveryDetails.etaMinutes, t),
		[deliveryDetails.etaMinutes, t],
	);
	const arrivalTimeLabel = useMemo(() => {
		if (deliveryDetails.etaMinutes <= 0) return "--:--";

		const arrival = new Date(
			Date.now() + deliveryDetails.etaMinutes * 60 * 1000,
		);
		return arrival.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}, [deliveryDetails.etaMinutes]);

	const isFormValid =
		name &&
		surname &&
		phone &&
		country &&
		city &&
		street &&
		cartItems.length > 0 &&
		(user || email);

	const priceDetailsData = useMemo(
		() => [
			{ image: box_icon, text: t("Product's price"), price: `${totalPrice} $` },
			{ image: tax_icon, text: t("Taxes"), price: `${tax} $` },
			{
				image: delivery_icon,
				text: t("Delivery"),
				price: `${deliveryPrice} $`,
			},
		],
		[t, totalPrice, tax, deliveryPrice],
	);

	const deliveryInfoRows = useMemo(
		() => [
			{
				icon: calendarIcon,
				text: t("Estimated arrival"),
				value: arrivalTimeLabel,
			},
			{
				icon: clockIcon,
				text: t("Delivery time"),
				value: deliveryDurationLabel || t("Delivery time unavailable"),
			},
			{
				icon: flagIcon,
				text: t("Distance"),
				value: `${deliveryDetails.distanceKm} ${t("km")}`,
			},
		],
		[t, arrivalTimeLabel, deliveryDurationLabel, deliveryDetails.distanceKm],
	);

	const handleOrder = () => {
		const newErrors: typeof errors = {};
		const fieldValues = { name, surname, email, phone, country, city, street };

		REQUIRED_FIELDS.forEach((f) => {
			const val = fieldValues[f];
			const err = validateField(f, val);
			if (err) newErrors[f] = err;
		});
		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		if (promocode && !PROMOCODES.includes(promocode)) {
			alert(t("Invalid promo code!"));
			return;
		}

		const orderData = {
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			scope: getStorageScope(user?.id),
			name,
			surname,
			email: user?.email || email,
			phone,
			address: { country, city, street, comment },
			items: cartItems,
			total: totalPrice + tax + deliveryPrice,
			promocode: promocode || null,
			delivery: deliveryDetails,
			deliverySource,
			status: "pending" as const,
		};

		const ordersStorageKey = getOrdersStorageKey(getStorageScope(user?.id));
		const existingOrders = readStorageJson<(typeof orderData)[]>(
			ordersStorageKey,
			[],
		);
		writeStorageJson(ordersStorageKey, [...existingOrders, orderData]);
		alert(t("Order placed!"));
	};

	return (
		<div className="app-shell w-full min-h-screen">
			<header className="app-header h-16 w-full fixed top-0 left-0 border-b border-[var(--gray-dark)] flex justify-between items-center px-[2vw] z-50">
				<Logo />
				<div className="flex items-center gap-2">
					<LangSwitcher />
					{user ? (
						<ProfileMenu
							username={user.username}
							onLoggedOut={() => setUser(null)}
						/>
					) : (
						<button
							className="sm:flex items-center gap-2 border-2 border-[var(--orange)] text-[var(--orange)] rounded-xl px-3 h-9 font-semibold text-[1rem] hover:bg-[var(--orange-light)] transition"
							onClick={() => navigate("/auth")}
						>
							<Translate>Login / Signup</Translate>
						</button>
					)}
				</div>
			</header>

			<div className="max-w-[98vw] mx-auto mt-9 px-6 pt-0 pb-8">
				<div className="mb-4 space-y-2">
					<p className="app-muted text-sm tracking-[0.3em] uppercase">
						<Translate>Checkout</Translate>
					</p>
					<h1 className="text-4xl font-extrabold">
						<Translate>Order summary</Translate>
					</h1>
					<p className="app-muted">
						<Translate>
							Check your cart, delivery details, and payment summary.
						</Translate>
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
					{/* Left: Cart + Form */}
					<div className="flex flex-col gap-6">
						<section className="app-surface rounded-2xl border border-[var(--gray-dark)]">
							<div className="flex justify-between items-center p-6">
								<Title titleContent="Cart" fontSize="text-xl" />
								<button
									className="flex items-center gap-2 app-muted hover:scale-[1.02] active:scale-[.98]"
									onClick={() =>
										cartItems.forEach((item) => setPizzaCount(item.pizza, 0))
									}
								>
									<span>
										<Translate>Clean cart</Translate>
									</span>
									<img src={trash_icon} className="w-5" />
								</button>
							</div>
							<div className="border-t" />
							<div className="p-3 flex flex-col gap-3 max-h-[280px] overflow-y-scroll round-scrollbar">
								{cartItems.map((item) => (
									<PizzaCard
										key={item.pizza.name}
										{...item}
										onChangeCount={setPizzaCount}
										onRemove={removePizza}
										variant="checkout"
									/>
								))}
							</div>
						</section>

						{/* Personal Info */}
						<section className="app-surface rounded-2xl border border-[var(--gray-dark)]">
							<div className="p-6">
								<Title titleContent="Personal information" fontSize="text-xl" />
							</div>
							<div className="border-t" />
							<div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Name */}
								<div className="flex flex-col gap-1">
									<input
										value={name}
										onChange={(e) => {
											setName(e.target.value);
											setErrors((prev) => ({
												...prev,
												name: validateField("name", e.target.value),
											}));
										}}
										placeholder={t("Name")}
										className="input p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
									/>
									{errors.name && (
										<p className="text-red-500 text-sm">{errors.name}</p>
									)}
								</div>
								{/* Surname */}
								<div className="flex flex-col gap-1">
									<input
										value={surname}
										onChange={(e) => {
											setSurname(e.target.value);
											setErrors((prev) => ({
												...prev,
												surname: validateField("surname", e.target.value),
											}));
										}}
										placeholder={t("Surname")}
										className="input p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
									/>
									{errors.surname && (
										<p className="text-red-500 text-sm">{errors.surname}</p>
									)}
								</div>
								{/* Email */}
								{!user && (
									<div className="flex flex-col gap-1">
										<input
											value={email}
											onChange={(e) => {
												setEmail(e.target.value);
												setErrors((prev) => ({
													...prev,
													email: validateField("email", e.target.value),
												}));
											}}
											placeholder={t("Email")}
											className="input p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
										/>
										{errors.email && (
											<p className="text-red-500 text-sm">{errors.email}</p>
										)}
									</div>
								)}
								{/* Phone */}
								<div className="flex flex-col gap-1">
									<input
										value={phone}
										onChange={(e) => {
											const formattedPhone = formatPhoneForCountry(
												e.target.value,
												currentDialCode,
											);
											setPhone(formattedPhone);
											setErrors((prev) => ({
												...prev,
												phone: validateField("phone", formattedPhone),
											}));
										}}
										placeholder={`+${currentDialCode} (__) ___ __ __`}
										className="input p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
									/>
									{errors.phone && (
										<p className="text-red-500 text-sm">{errors.phone}</p>
									)}
								</div>
							</div>
						</section>

						{/* Address */}
						<section className="app-surface rounded-2xl border border-[var(--gray-dark)]">
							<div className="p-6">
								<Title titleContent="Address" fontSize="text-xl" />
							</div>
							<div className="border-t" />
							<div className="p-6 flex flex-col gap-6">
								{renderSelect(
									country,
									(v) => {
										setCountry(v);
										setCity("");
										setErrors((prev) => ({
											...prev,
											country: validateField("country", v),
										}));
									},
									countryOptions,
									t("Select Country"),
									false,
									errors.country,
								)}
								{renderSelect(
									city,
									(v) => {
										setCity(v);
										setErrors((prev) => ({
											...prev,
											city: validateField("city", v),
										}));
									},
									cityOptions,
									t("Select City"),
									!country,
									errors.city,
								)}
								<div className="flex flex-col gap-1">
									<input
										value={street}
										onChange={(e) => {
											setStreet(e.target.value);
											setErrors((prev) => ({
												...prev,
												street: validateField("street", e.target.value),
											}));
										}}
										placeholder={t("Street")}
										className="input p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
									/>
									{errors.street && (
										<p className="text-red-500 text-sm">{errors.street}</p>
									)}
								</div>
								<textarea
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									placeholder={t("Comment")}
									className="input h-28 resize-y p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
								/>
							</div>
						</section>
					</div>

					{/* Right: Price Summary */}
					<aside className="app-surface rounded-2xl border border-[var(--gray-dark)] flex flex-col h-fit">
						<div className="p-6">
							<p className="app-muted text-sm mb-1">
								<Translate>Overall:</Translate>
							</p>
							<h2 className="text-3xl font-semibold">
								{totalPrice + tax + deliveryPrice} $
							</h2>
						</div>
						<div className="border-t" />
						<div className="p-6 flex flex-col gap-4">
							{priceDetailsData.map(({ image, text, price }) => (
								<div key={text} className="flex items-baseline w-full">
									<div className="flex gap-2 items-center whitespace-nowrap">
										<img src={image} />
										<p>{text}</p>
									</div>
									<span className="dots"></span>
									<p className="font-bold whitespace-nowrap">{price}</p>
								</div>
							))}
							{deliveryInfoRows.map(({ icon, text, value }) => (
								<div key={text} className="flex items-baseline w-full">
									<div className="flex gap-2 items-center whitespace-nowrap">
										<img
											src={icon}
											alt=""
											className="w-4 h-4 shrink-0 opacity-80"
											aria-hidden="true"
										/>
										<p>{text}</p>
									</div>
									<span className="dots"></span>
									<p className="font-bold whitespace-nowrap">{value}</p>
								</div>
							))}
						</div>
						<div className="border-t" />
						<div className="p-6 flex flex-col gap-4">
							<input
								value={promocode}
								onChange={(e) => setPromocode(e.target.value)}
								placeholder={t("Promocode")}
								className="input p-2 rounded-xl bg-[var(--gray)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
							/>
							<Button
								onClick={handleOrder}
								disabled={!isFormValid || totalPrice === 0 || loading}
								className={
									loading
										? "bg-gray-400 hover:brightness-100 cursor-not-allowed"
										: ""
								}
							>
								{loading ? t("Processing...") : t("Start payment")}
							</Button>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
