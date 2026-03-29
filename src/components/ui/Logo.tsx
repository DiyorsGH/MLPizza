import { Link } from "react-router-dom";
import { logo } from "../../data/data";
import { Translate } from "../translate/Translate";

export default function Logo() {
	return (
		<Link to="/" className="flex items-center gap-2.5 shrink-0">
			<img
				src={logo}
				alt="ML Pizza logo"
				className="h-8 w-8"
				width="32"
				height="32"
				decoding="async"
			/>
			<div className="hidden sm:flex flex-col leading-none">
				<span className="font-black text-xl tracking-tight">ML PIZZA</span>
				<span className="text-[11px] app-muted font-medium">
					<Translate>It can't get tastier</Translate>
				</span>
			</div>
		</Link>
	);
}
