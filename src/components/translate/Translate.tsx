import { useLanguage } from "../../contexts/LanguageContext";

type TranslateProps = { children: string };

export function Translate({ children }: TranslateProps) {
	const { t } = useLanguage();
	return <>{t(children)}</>;
}
