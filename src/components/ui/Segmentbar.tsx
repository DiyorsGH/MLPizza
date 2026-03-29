import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface SegmentbarProps {
	elems: string[];
	selectedIndex?: number;
	onSelect?: (i: number) => void;
	width?: string;
	height?: string;
	/** "rounded" → rounded-xl (default), "pill" → rounded-full */
	shape?: "rounded" | "pill";
}

export default function Segmentbar({
	elems,
	selectedIndex = 0,
	onSelect,
	width,
	height,
	shape = "rounded",
}: SegmentbarProps) {
	const { t } = useLanguage();
	const [active, setActive] = useState(selectedIndex);
	const ref = useRef<HTMLDivElement>(null);
	const [style, setStyle] = useState({ left: 0, width: 0 });

	useEffect(() => {
		setActive(selectedIndex);
	}, [selectedIndex]);

	const measureIndicator = (index: number) => {
		const btn = ref.current?.querySelectorAll("button")[index] as HTMLElement;
		if (!btn) return;
		setStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
	};

	useEffect(() => {
		measureIndicator(active);
	}, [active]);

	useEffect(() => {
		requestAnimationFrame(() => measureIndicator(active));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const select = (i: number) => {
		setActive(i);
		onSelect?.(i);
	};

	const roundedClass = shape === "pill" ? "rounded-full" : "rounded-xl";

	return (
		<div
			ref={ref}
			className={`relative flex ${width ?? ""} ${height ?? ""} bg-[var(--gray-dark)] ${roundedClass} overflow-hidden px-2`}
		>
			{elems.map((el, i) => (
				<button
					key={i}
					onClick={() => select(i)}
					className={`flex-1 z-10 text-medium font-medium transition-colors ${
						active === i ? "text-[var(--orange)]" : "app-muted"
					}`}
				>
					{t(el)}
				</button>
			))}
			<div
				className={`absolute top-1/2 h-[75%] app-surface ${roundedClass} -translate-y-1/2 transition-all duration-300 z-0 shadow-md`}
				style={style}
			/>
		</div>
	);
}
