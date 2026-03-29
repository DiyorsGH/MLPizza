// AuthPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eye, eye_off } from "../assets/icons";
import { Translate } from "../components/translate/Translate";
import { login, signUp } from "../lib/supabase";

export default function AuthPage() {
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (mode === "login") setMessage("Please login");
	}, [mode]);

	const handleSubmit = async () => {
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			setError("");
			setMessage("");

			if (mode === "signup") {
				await signUp(email, password, username);
				navigate("/auth-email", {
					state: { email, fromSignup: true },
				});
				return;
			} else {
				await login(email, password);
				setMessage("Login successful!");
				navigate("/"); // redirect after login
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const returnHandle = () => {
		navigate("/");
	};

	return (
		<div className="min-h-screen flex items-center justify-center app-shell px-4">
			<div
				className="w-12 h-12 rounded-full bg-[var(--gray-dark)] text-xl flex items-center justify-center mr-4 cursor-pointer"
				onClick={returnHandle}
			>
				←
			</div>
			<div className="app-surface p-8 rounded-[28px] shadow-md w-full max-w-sm border border-[var(--gray-dark)]">
				<h2 className="text-2xl font-bold mb-6">
					<Translate>{mode === "login" ? "Login" : "Sign Up"}</Translate>
				</h2>

				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="email"
					className="w-full p-2 mb-4 bg-[var(--gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
				/>
				<div className="relative w-full">
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={
							mode === "login" ? "current-password" : "new-password"
						}
						className="w-full p-2 mb-1 bg-[var(--gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--orange)] pr-10"
						// pr-10 adds padding to prevent text overlapping the button
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute top-1/2 right-3 -translate-y-1/2"
					>
						{showPassword ? (
							<img src={eye_off} alt="Hide password" className="w-5 h-5" />
						) : (
							<img src={eye} alt="Show password" className="w-5 h-5" />
						)}
					</button>
				</div>

				{mode === "signup" && (
					<>
						{password.length >= 8 ? (
							<p className="text-xs app-success-text mb-4">
								<Translate>Normal password</Translate>
							</p>
						) : (
							<p className="mb-4 rounded-xl app-danger-surface px-3 py-2 text-xs font-medium app-danger-text">
								<Translate>Password must be at least 8 characters.</Translate>
							</p>
						)}
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoComplete="username"
							className="w-full p-2 mb-4 bg-[var(--gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
						/>
					</>
				)}

				{error && (
					<p className="mb-3 rounded-xl app-danger-surface px-3 py-2 text-sm font-medium app-danger-text">
						{error}
					</p>
				)}
				{message && (
					<p className="mb-3 rounded-xl app-success-surface px-3 py-2 text-sm font-medium app-success-text">
						{message}
					</p>
				)}

				<button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className={`w-full text-white py-2 rounded-xl transition mb-4 ${
						isSubmitting
							? "bg-gray-400 cursor-not-allowed"
							: "bg-[var(--orange)] hover:brightness-[1.2] active:brightness-[0.8] active:scale-[0.95]"
					}`}
				>
					{isSubmitting
						? mode === "login"
							? "Logging in..."
							: "Signing up..."
						: mode === "login"
							? "Login"
							: "Sign Up"}
				</button>

				<p className="text-center text-sm app-muted">
					<Translate>
						{mode === "login"
							? "Don't have an account?"
							: "Already have an account?"}
					</Translate>{" "}
					<button
						onClick={() => {
							if (isSubmitting) return;
							setMode(mode === "login" ? "signup" : "login");
							setError("");
							setMessage("");
						}}
						disabled={isSubmitting}
						className="text-[var(--orange)] font-semibold"
					>
						<Translate>{mode === "login" ? "Sign Up" : "Login"}</Translate>
					</button>
				</p>
			</div>
		</div>
	);
}
