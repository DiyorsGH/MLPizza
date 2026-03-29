// refactored

import { useLanguage } from "../../contexts/LanguageContext";

export default function Title({
	titleContent,
	fontSize,
	margin,
	bold,
}: {
	titleContent: string;
	fontSize?: string;
	margin?: string;
	bold?: string;
}) {
	const { t } = useLanguage();

	return (
		<p className={`${fontSize} font-[590] ${margin} ${bold}`}>
			{t(titleContent)}
		</p>
	);
}
