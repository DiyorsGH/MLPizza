import { Translate } from "../translate/Translate";

export default function CartModalFooterItems({
	text,
	value,
}: {
	text: string;
	value: number;
}) {
	return (
		<div className="w-[100%] h-[10%] flex items-baseline">
			<span className="whitespace-nowrap text-big">
				<Translate>{text}</Translate> :
			</span>
			<span className="dots"></span>
			<span className="whitespace-nowrap font-bold text-big">
				{Math.round(value * 100) / 100} $
			</span>
		</div>
	);
}
