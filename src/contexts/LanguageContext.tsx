import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SupportedLanguage } from "../utils/i18n";
import { translateText } from "../utils/i18n";

type LanguageContextType = {
	lang: SupportedLanguage;
	setLang: (lang: SupportedLanguage) => void;
	t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
	lang: "en",
	setLang: () => {},
	t: (text) => text,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [lang, setLang] = useState<SupportedLanguage>(() => {
		const savedLang = localStorage.getItem("language");
		return savedLang === "rus" ? "rus" : "en";
	});

	useEffect(() => {
		localStorage.setItem("language", lang);
	}, [lang]);

	const value = useMemo(
		() => ({
			lang,
			setLang,
			t: (text: string) => translateText(text, lang),
		}),
		[lang],
	);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => useContext(LanguageContext);
