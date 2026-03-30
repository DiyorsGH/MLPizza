import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./styles/main.css";

import { Elements } from "@stripe/react-stripe-js";
// ✅ Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Translate } from "./components/translate/Translate";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PreferencesProvider } from "./contexts/PreferencesContext";

// 🔴 PUT YOUR PUBLIC KEY HERE
const stripePromise = loadStripe(
	"pk_test_51TFA1LItwPpJqUrhlz5FUzZYDPLnpiVkWR2lAB1ZIWcR4Gj3t8pJ94rfKeThy5X3YGe5yosdQSPNckwAP4uvIRbd001zU7dR5w",
);

const MainPage = lazy(() => import("./pages/MainPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AuthEmailPage = lazy(() => import("./pages/AuthEmailPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function AppFallback() {
	return (
		<div className="app-shell flex min-h-screen items-center justify-center px-4">
			<div className="app-surface w-full max-w-sm rounded-[28px] border border-[var(--gray-dark)] p-8 text-center shadow-sm">
				<div className="mx-auto mb-4 h-12 w-12 rounded-full skeleton" />
				<p className="text-lg font-semibold">
					<Translate>Loading page...</Translate>
				</p>
				<p className="mt-2 app-muted">
					<Translate>Preparing your pizza experience.</Translate>
				</p>
			</div>
		</div>
	);
}

function App() {
	return (
		<CartProvider>
			<Suspense fallback={<AppFallback />}>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/auth" element={<AuthPage />} />
					<Route path="/auth-email" element={<AuthEmailPage />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</Suspense>
		</CartProvider>
	);
}

const root = createRoot(document.getElementById("root")!);

root.render(
	<Router>
		<PreferencesProvider>
			<LanguageProvider>
				{/* ✅ Stripe wrapper */}
				<Elements stripe={stripePromise}>
					<App />
				</Elements>
			</LanguageProvider>
		</PreferencesProvider>
	</Router>,
);
