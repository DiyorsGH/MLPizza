// refactored

export default function Line({
	width,
	margin,
}: {
	width: string;
	margin?: string;
}) {
	return (
		<div
			className={`h-0.5 rounded-2xl ${width} bg-[color:var(--gray)] ${margin}`}
		></div>
	);
}
