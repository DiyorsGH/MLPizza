import { useLocation, useNavigate } from "react-router-dom";
import { Translate } from "../components/translate/Translate";

export default function AuthEmailPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email as string | undefined;

	return (
		<div className="min-h-screen flex items-center justify-center app-shell px-4">
			<div className="app-surface p-8 rounded-[28px] shadow-md text-center max-w-md w-full border border-[var(--gray-dark)]">
				<h2 className="text-2xl font-bold mb-4">
					<Translate>Confirm your email</Translate>
				</h2>
				<p>
					<Translate>We sent a confirmation link</Translate>
					{email ? ` to ${email}` : ""}. Please open that email and
					<Translate> confirm your account to finish registration.</Translate>
				</p>
				<p className="mt-4 text-sm app-muted">
					<Translate>
						After you confirm the email, you will be redirected to the main page
						automatically.
					</Translate>
				</p>
				<div className="mt-6 flex gap-3 justify-center">
					<button
						onClick={() => navigate("/auth")}
						className="px-4 py-2 rounded-xl border border-[var(--orange)] text-[var(--orange)] font-semibold hover:bg-[var(--orange-light)] transition"
					>
						<Translate>Back to auth</Translate>
					</button>
					<button
						onClick={() => navigate("/")}
						className="px-4 py-2 rounded-xl bg-[var(--orange)] text-white font-semibold hover:brightness-110 transition"
					>
						<Translate>Go home</Translate>
					</button>
				</div>
			</div>
		</div>
	);
}
