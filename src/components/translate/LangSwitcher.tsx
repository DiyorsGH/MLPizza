import { useEffect, useRef, useState } from "react";
import { globe } from "../../assets/icons";
import { useLanguage } from "../../contexts/LanguageContext";
import { Translate } from "./Translate";

export const LangSwitcher = () => {
	const { lang, setLang } = useLanguage();
	const [open, setOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const languages = [
		{ code: "en" as const, label: "English" },
		{ code: "rus" as const, label: "Russian" },
	];

	useEffect(() => {
		function handleOutsideClick(event: MouseEvent) {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	return (
		<div className="relative" ref={wrapperRef}>
			<button
				onClick={() => setOpen(!open)}
				className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--gray-dark)] app-surface-soft transition hover:border-[var(--orange)] hover:text-[var(--orange)]"
				title="Change language"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label="Change language"
			>
				<img src={globe} alt="Language" className="w-6 h-6" />
			</button>

			{open && (
				<div
					className="absolute right-0 mt-2 w-32 overflow-hidden rounded-2xl border border-[var(--gray-dark)] app-surface z-50"
					style={{ boxShadow: "var(--overlay-shadow)" }}
					role="menu"
				>
					{languages.map((l) => (
						<button
							key={l.code}
							className={`block w-full text-left px-3 py-2 hover:bg-[var(--orange-light)] transition ${
								lang === l.code ? "font-bold text-[var(--orange)]" : ""
							}`}
							onClick={() => {
								setLang(l.code);
								setOpen(false);
							}}
							role="menuitem"
						>
							<Translate>{l.label}</Translate>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
