import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, supabase } from "../../lib/supabase";
import { LangSwitcher } from "../translate/LangSwitcher";
import { Translate } from "../translate/Translate";
import { Logo } from "../ui";
import ProfileMenu from "./ProfileMenu";

export default function AccountShell({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<{
		id: string;
		email: string;
		username: string;
	} | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchUser() {
			const user = await getCurrentUser();
			setCurrentUser(user);
		}

		fetchUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			fetchUser();
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<div className="min-h-screen app-shell">
			<header className="app-header h-16 border-b border-[var(--gray-dark)]">
				<div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-[max(16px,2vw)]">
					<Logo />
					<div className="flex items-center gap-2">
						<LangSwitcher />
						{currentUser ? (
							<ProfileMenu
								username={currentUser.username}
								onLoggedOut={() => setCurrentUser(null)}
							/>
						) : (
							<button
								onClick={() => navigate("/auth")}
								className="rounded-xl border-2 border-[var(--orange)] px-4 py-2 font-semibold text-[var(--orange)] transition hover:bg-[var(--orange-light)]"
							>
								<Translate>Login / Signup</Translate>
							</button>
						)}
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
		</div>
	);
}
