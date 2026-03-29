import { Link } from "react-router-dom";
import { Translate } from "../components/translate/Translate";

export default function ErrorPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-4 app-shell px-4 text-center">
			<h1 className="text-[6rem] font-black text-[var(--orange)] leading-none">
				404
			</h1>
			<p className="text-2xl font-semibold">
				<Translate>Page not found</Translate>
			</p>
			<p className="app-muted">
				<Translate>The page you're looking for doesn't exist.</Translate>
			</p>
			<Link
				to="/"
				className="mt-4 px-6 py-3 bg-[var(--orange)] text-white rounded-xl font-medium hover:brightness-90 transition"
			>
				← <Translate>Back to menu</Translate>
			</Link>
		</div>
	);
}
