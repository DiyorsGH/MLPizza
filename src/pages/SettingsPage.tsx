import AccountShell from "../components/account/AccountShell";
import { Translate } from "../components/translate/Translate";
import { useLanguage } from "../contexts/LanguageContext";
import { usePreferences } from "../contexts/PreferencesContext";

const accentOptions = [22, 207, 142, 292, 358];

export default function SettingsPage() {
	const { lang, setLang } = useLanguage();
	const {
		theme,
		setTheme,
		accentHue,
		setAccentHue,
		rememberCheckoutDetails,
		setRememberCheckoutDetails,
		showDeliveryLogs,
		setShowDeliveryLogs,
	} = usePreferences();

	return (
		<AccountShell>
			<section className="space-y-8">
				<div className="space-y-3">
					<p className="app-muted text-sm tracking-[0.3em] uppercase">
						<Translate>Settings</Translate>
					</p>
					<h1 className="text-4xl font-extrabold">
						<Translate>Account settings</Translate>
					</h1>
					<p className="app-muted">
						<Translate>
							Preferences are saved automatically on this device.
						</Translate>
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<section className="app-surface rounded-[28px] border border-[var(--gray-dark)] p-6">
						<h2 className="text-xl font-bold">
							<Translate>Appearance</Translate>
						</h2>

						<div className="mt-5 space-y-5">
							<div>
								<p className="mb-3 font-semibold">
									<Translate>Theme</Translate>
								</p>
								<div className="flex gap-3">
									{(["light", "dark"] as const).map((mode) => (
										<button
											key={mode}
											onClick={() => setTheme(mode)}
											className={`min-w-32 rounded-2xl border px-4 py-3 font-semibold transition ${
												theme === mode
													? "border-[var(--orange)] bg-[var(--orange-light)] text-[var(--orange)]"
													: "border-[var(--gray-dark)] app-surface-soft text-[var(--text-main)]"
											}`}
											aria-pressed={theme === mode}
										>
											<Translate>
												{mode === "light" ? "Light" : "Dark"}
											</Translate>
										</button>
									))}
								</div>
							</div>

							<div>
								<p className="mb-3 font-semibold">
									<Translate>Accent color</Translate>
								</p>

								<div className="flex flex-wrap gap-3">
									{accentOptions.map((hue) => (
										<button
											key={hue}
											onClick={() => setAccentHue(hue)}
											className={`h-11 w-11 rounded-full border-4 transition ${
												accentHue === hue
													? "border-[var(--surface)] shadow-[0_0_0_2px_var(--text-main)]"
													: "border-transparent"
											}`}
											style={{ backgroundColor: `hsl(${hue} 100% 50%)` }}
											aria-label={`Accent color ${hue}`}
											aria-pressed={accentHue === hue}
										/>
									))}
								</div>
							</div>
						</div>
					</section>

					<section className="app-surface rounded-[28px] border border-[var(--gray-dark)] p-6">
						<h2 className="text-xl font-bold">
							<Translate>Preferences</Translate>
						</h2>

						<div className="mt-5 space-y-5">
							<div>
								<label className="mb-2 block font-semibold">
									<Translate>Language</Translate>
								</label>
								<select
									value={lang}
									onChange={(event) =>
										setLang(event.target.value === "rus" ? "rus" : "en")
									}
									className="w-full rounded-2xl border border-[var(--gray-dark)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text-main)]"
								>
									<option value="en">English</option>
									<option value="rus">Русский</option>
								</select>
							</div>

							<label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--gray-dark)] bg-[var(--surface-soft)] px-4 py-3">
								<span className="font-semibold">
									<Translate>Remember checkout details</Translate>
								</span>
								<input
									type="checkbox"
									checked={rememberCheckoutDetails}
									onChange={(event) =>
										setRememberCheckoutDetails(event.target.checked)
									}
									className="h-5 w-5 accent-[var(--orange)]"
								/>
							</label>

							<label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--gray-dark)] bg-[var(--surface-soft)] px-4 py-3">
								<span className="font-semibold">
									<Translate>Delivery debug logs</Translate>
								</span>
								<input
									type="checkbox"
									checked={showDeliveryLogs}
									onChange={(event) =>
										setShowDeliveryLogs(event.target.checked)
									}
									className="h-5 w-5 accent-[var(--orange)]"
								/>
							</label>
						</div>
					</section>
				</div>
			</section>
		</AccountShell>
	);
}
