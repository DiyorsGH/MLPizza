import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../assets/icons";
import { logout } from "../../lib/supabase";
import { Translate } from "../translate/Translate";

type ProfileMenuProps = {
	username?: string | null;
	onLoggedOut?: () => void;
};

export default function ProfileMenu({
	username,
	onLoggedOut,
}: ProfileMenuProps) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleOutsideClick(event: MouseEvent) {
			if (!menuRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	const handleLogout = async () => {
		await logout();
		onLoggedOut?.();
		setOpen(false);
		navigate("/");
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="flex h-10 items-center gap-2 rounded-xl border-2 border-[var(--orange)] px-4 font-semibold text-[var(--orange)] transition hover:bg-[var(--orange-light)]"
				aria-haspopup="menu"
				aria-expanded={open}
			>
				<img src={login} alt="" className="w-4 h-4" />
				<span className="max-w-32 truncate">
					{username || <Translate>Profile</Translate>}
				</span>
			</button>

			{open && (
				<div
					className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-[var(--gray-dark)] bg-[var(--surface)] z-50"
					style={{ boxShadow: "var(--overlay-shadow)" }}
					role="menu"
				>
					<Link
						to="/settings"
						onClick={() => setOpen(false)}
						className="block w-full px-4 py-3 text-left hover:bg-[var(--orange-light)] transition"
						role="menuitem"
					>
						<Translate>Settings</Translate>
					</Link>
					<Link
						to="/orders"
						onClick={() => setOpen(false)}
						className="block w-full px-4 py-3 text-left hover:bg-[var(--orange-light)] transition"
						role="menuitem"
					>
						<Translate>Orders</Translate>
					</Link>
					<button
						onClick={handleLogout}
						className="block w-full px-4 py-3 text-left app-danger-text transition hover:bg-[var(--danger-bg)]"
						role="menuitem"
					>
						<Translate>Logout</Translate>
					</button>
				</div>
			)}
		</div>
	);
}
