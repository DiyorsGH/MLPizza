import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

const DEFAULT_ACCENT_HUE = 22;

function clampHue(value: number) {
	const normalized = Number.isFinite(value) ? value % 360 : DEFAULT_ACCENT_HUE;
	return normalized >= 0 ? normalized : normalized + 360;
}

function hexToHue(hex: string) {
	const normalized = hex.replace("#", "");
	const fullHex =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: normalized;

	if (fullHex.length !== 6) return DEFAULT_ACCENT_HUE;

	const r = Number.parseInt(fullHex.slice(0, 2), 16) / 255;
	const g = Number.parseInt(fullHex.slice(2, 4), 16) / 255;
	const b = Number.parseInt(fullHex.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	if (delta === 0) return DEFAULT_ACCENT_HUE;

	let hue = 0;

	switch (max) {
		case r:
			hue = ((g - b) / delta) % 6;
			break;
		case g:
			hue = (b - r) / delta + 2;
			break;
		default:
			hue = (r - g) / delta + 4;
			break;
	}

	return clampHue(Math.round(hue * 60));
}

function parseStoredAccentHue(value: string | null) {
	if (!value) return DEFAULT_ACCENT_HUE;

	const numeric = Number(value);
	if (!Number.isNaN(numeric)) {
		return clampHue(numeric);
	}

	return hexToHue(value);
}

type PreferencesContextType = {
	theme: ThemeMode;
	setTheme: (theme: ThemeMode) => void;
	accentHue: number;
	setAccentHue: (hue: number) => void;
	rememberCheckoutDetails: boolean;
	setRememberCheckoutDetails: (value: boolean) => void;
	showDeliveryLogs: boolean;
	setShowDeliveryLogs: (value: boolean) => void;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<ThemeMode>(() => {
		const savedTheme = localStorage.getItem("theme");
		return savedTheme === "dark" ? "dark" : "light";
	});
	const [accentHue, setAccentHue] = useState(() =>
		parseStoredAccentHue(
			localStorage.getItem("accentHue") ?? localStorage.getItem("accentColor"),
		),
	);
	const [rememberCheckoutDetails, setRememberCheckoutDetails] = useState(() => {
		const saved = localStorage.getItem("rememberCheckoutDetails");
		return saved ? saved === "true" : true;
	});
	const [showDeliveryLogs, setShowDeliveryLogs] = useState(() => {
		const saved = localStorage.getItem("showDeliveryLogs");
		return saved ? saved === "true" : true;
	});

	useEffect(() => {
		localStorage.setItem("theme", theme);
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	useEffect(() => {
		localStorage.setItem("accentHue", String(accentHue));
		localStorage.removeItem("accentColor");
		document.documentElement.style.setProperty(
			"--accent-hue",
			String(accentHue),
		);
	}, [accentHue]);

	useEffect(() => {
		localStorage.setItem(
			"rememberCheckoutDetails",
			String(rememberCheckoutDetails),
		);
	}, [rememberCheckoutDetails]);

	useEffect(() => {
		localStorage.setItem("showDeliveryLogs", String(showDeliveryLogs));
	}, [showDeliveryLogs]);

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			accentHue,
			setAccentHue,
			rememberCheckoutDetails,
			setRememberCheckoutDetails,
			showDeliveryLogs,
			setShowDeliveryLogs,
		}),
		[theme, accentHue, rememberCheckoutDetails, showDeliveryLogs],
	);

	return (
		<PreferencesContext.Provider value={value}>
			{children}
		</PreferencesContext.Provider>
	);
}

export function usePreferences() {
	const context = useContext(PreferencesContext);

	if (!context) {
		throw new Error("usePreferences must be used inside PreferencesProvider");
	}

	return context;
}
