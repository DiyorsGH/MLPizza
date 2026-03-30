import { useLanguage } from "../../contexts/LanguageContext";
import { sort } from "../../data/data";
import { Translate } from "../translate/Translate";

interface CategoryBarProps {
	segments: string[];
	activeSegment: number;
	setActiveSegment: (i: number) => void;
	activeSort: number;
	setActiveSort: (i: number) => void;
	sortOptions: string[];
	sortIcon?: string;
	activeFilterCount?: number;
	onFilterClick?: () => void;
}

export default function CategoryBar({
	segments,
	activeSegment,
	setActiveSegment,
	activeSort,
	setActiveSort,
	sortOptions,
	activeFilterCount = 0,
	onFilterClick,
}: CategoryBarProps) {
	const { t } = useLanguage();
	return (
		<div className="h-14 shrink-0 app-surface border-b border-[var(--gray-dark)] flex items-center gap-2 px-[2vw] z-20">
			{/* Category pills — horizontally scrollable */}
			<div className="flex-1 overflow-x-auto hide-scrollbar">
				<div className="flex gap-1.5 min-w-max py-1">
					{segments.map((seg, i) => (
						<button
							key={seg}
							onClick={() => setActiveSegment(i)}
							className={`px-4 py-1.5 rounded-full text-[1rem] font-semibold whitespace-nowrap transition ${
								activeSegment === i
									? "bg-[var(--orange)] text-white shadow-sm"
									: "bg-[var(--gray)] text-[var(--text-main)] hover:brightness-95"
							}`}
						>
							{t(seg)}
						</button>
					))}
				</div>
			</div>

			{/* Sort */}
			<div className="shrink-0 flex items-center gap-2 bg-[var(--gray)] rounded-xl px-3 h-9">
				<img src={sort} alt="" className="w-4 h-4 opacity-60" />
				<span className="text-[1rem] app-muted hidden sm:inline">
					<Translate>Sort:</Translate>
				</span>
				<select
					value={activeSort}
					onChange={(e) => setActiveSort(Number(e.target.value))}
					className="bg-transparent appearance-none outline-none text-[var(--orange)] cursor-pointer text-[1rem] font-semibold"
				>
					{sortOptions.map((opt, i) => (
						<option key={opt} value={i}>
							{t(opt)}
						</option>
					))}
				</select>
			</div>

			{/* Filter button — visible on mobile (sidebar hidden by default) */}
			<button
				onClick={onFilterClick}
				className="lg:hidden shrink-0 relative flex items-center gap-1.5 bg-[var(--gray)] rounded-xl px-3 h-9 text-sm font-semibold text-[var(--text-main)] hover:brightness-95 transition"
				aria-label="Open filters"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="opacity-70"
				>
					<line x1="4" y1="6" x2="20" y2="6" />
					<line x1="8" y1="12" x2="16" y2="12" />
					<line x1="11" y1="18" x2="13" y2="18" />
				</svg>
				<span className="hidden xs:inline">
					<Translate>Filter</Translate>
				</span>
				{activeFilterCount > 0 && (
					<span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--orange)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
						{activeFilterCount}
					</span>
				)}
			</button>
		</div>
	);
}
