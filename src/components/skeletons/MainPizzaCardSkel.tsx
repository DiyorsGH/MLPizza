import { Line } from "../ui";
import type { PizzaCardVariant } from "../ui/PizzaCard";

export default function PizzaCardSkeleton({
	variant,
}: {
	variant: PizzaCardVariant;
}) {
	switch (variant) {
		case "main":
			return (
				<div className="card-container border-2 border-[var(--gray)] rounded-2xl app-surface shadow-sm grid grid-rows-[140px_1px_132px] overflow-hidden w-full h-full animate-skeleton-fade">
					{/* IMAGE PLACEHOLDER */}
					<div className="relative w-full h-full flex items-center justify-center app-surface-soft">
						<div className="w-[120px] h-[120px] rounded-full bg-[var(--gray)] skeleton" />
					</div>

					{/* LINE SEPARATOR */}
					<Line width="w-full" />

					{/* INFO PLACEHOLDER */}
					<div className="p-3 px-4 grid grid-rows-[20px_30px_1fr] gap-2 h-full app-surface">
						{/* NAME */}
						<div className="w-[120px] h-[20px] bg-[var(--gray)] rounded-xl skeleton"></div>

						{/* INGREDIENTS */}
						<div className="h-[30px] w-full bg-[var(--gray)] rounded-xl skeleton"></div>

						{/* PRICE & BUTTON */}
						<div className="grid grid-cols-[50px_1fr_70px] items-center gap-2">
							<div className="h-[20px] w-full bg-[var(--gray)] rounded-xl skeleton"></div>
							<div></div> {/* Empty middle column for spacing */}
							<div className="w-full h-[20px] bg-[var(--gray)] rounded-xl skeleton"></div>
						</div>
					</div>
				</div>
			);
		case "cart":
			return <div></div>;
		case "checkout":
			return <div></div>;
		default:
			break;
	}
}
