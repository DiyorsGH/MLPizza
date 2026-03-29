import { useEffect, useMemo, useState } from "react";
import AccountShell from "../components/account/AccountShell";
import { Translate } from "../components/translate/Translate";
import { getCurrentUser } from "../lib/supabase";
import {
	getOrdersStorageKey,
	getStorageScope,
	readStorageJson,
} from "../utils/storage";

type StoredOrder = {
	id: string;
	createdAt: string;
	total: number;
	items: {
		pizza: { name: string; img: string };
		count: number;
		size?: string | null;
		crust?: string | null;
		adds?: string[] | null;
		addsPrice?: number;
	}[];
	status?: "paid" | "rejected" | "pending";
};

export default function OrdersPage() {
	const [orders, setOrders] = useState<StoredOrder[]>([]);
	const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
	const [isGuestMode, setIsGuestMode] = useState(true);

	useEffect(() => {
		async function loadOrders() {
			const user = await getCurrentUser();
			const scope = getStorageScope(user?.id);
			const storedOrders = readStorageJson<StoredOrder[]>(
				getOrdersStorageKey(scope),
				[],
			);

			const normalizedOrders = storedOrders
				.map((order) => ({
					...order,
					status: order.status ?? "pending",
				}))
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);

			setIsGuestMode(!user);
			setOrders(normalizedOrders);
			setExpandedOrderId(normalizedOrders[0]?.id ?? null);
		}

		loadOrders();
	}, []);

	const totalOrders = useMemo(() => orders.length, [orders]);

	return (
		<AccountShell>
			<section className="space-y-8">
				<div className="space-y-3">
					<p className="app-muted text-sm tracking-[0.3em] uppercase">
						<Translate>Orders</Translate>
					</p>
					<h1 className="text-4xl font-extrabold">
						<Translate>My orders</Translate>
					</h1>
					<p className="app-muted text-base">
						{isGuestMode ? (
							<Translate>Guest orders are shown on this device only.</Translate>
						) : (
							`${totalOrders} ${totalOrders === 1 ? "order" : "orders"}`
						)}
					</p>
				</div>

				{orders.length === 0 ? (
					<div className="app-surface rounded-[28px] border border-[var(--gray-dark)] px-8 py-12 text-center">
						<h2 className="text-2xl font-bold">
							<Translate>No orders yet</Translate>
						</h2>
						<p className="app-muted mt-3">
							<Translate>Your placed orders will appear here.</Translate>
						</p>
					</div>
				) : (
					<div className="space-y-6">
						{orders.map((order, index) => {
							const isExpanded = expandedOrderId === order.id;

							return (
								<article
									key={order.id}
									className={`app-surface rounded-[30px] border px-6 py-5 transition ${
										isExpanded
											? "border-[var(--orange)] shadow-[0_16px_40px_var(--accent-shadow)]"
											: "border-[var(--gray-dark)]"
									}`}
								>
									<button
										onClick={() =>
											setExpandedOrderId((prev) =>
												prev === order.id ? null : order.id,
											)
										}
										className="flex w-full items-center justify-between gap-4 text-left"
										aria-expanded={isExpanded}
										aria-controls={`order-panel-${order.id}`}
									>
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
											<h2 className="text-2xl font-extrabold">
												Order #{totalOrders - index}
											</h2>
											<span className="app-muted text-base">
												{new Date(order.createdAt).toLocaleString()}
											</span>
										</div>
										<div className="flex items-center gap-4">
											<span
												className={`text-2xl text-[var(--text-muted)] transition ${
													isExpanded ? "rotate-180" : ""
												}`}
											>
												˅
											</span>
										</div>
									</button>

									{isExpanded && (
										<div
											id={`order-panel-${order.id}`}
											className="mt-5 border-t border-[var(--gray-dark)] pt-5"
										>
											<div className="space-y-4">
												{order.items.map((item) => (
													<div
														key={`${order.id}-${item.pizza.name}`}
														className="flex items-center gap-4 rounded-2xl border border-[var(--gray-dark)] p-4"
													>
														<img
															src={item.pizza.img}
															alt={item.pizza.name}
															loading="lazy"
															decoding="async"
															className="h-16 w-16 rounded-full object-cover"
														/>
														<div className="min-w-0 flex-1">
															<p className="truncate text-lg font-bold">
																{item.pizza.name}
															</p>
															<p className="app-muted text-sm">
																{[item.size, item.crust]
																	.filter(Boolean)
																	.join(", ") || "Classic"}
															</p>
															{item.adds?.length ? (
																<p className="app-muted text-sm">
																	+ {item.adds.join(", ")}
																</p>
															) : null}
														</div>
														<div className="text-right">
															<p className="text-lg font-extrabold">
																{item.count}x
															</p>
														</div>
													</div>
												))}
											</div>

											<div className="mt-5 flex items-center justify-between border-t border-[var(--gray-dark)] pt-4 text-xl font-bold">
												<span>
													<Translate>Total</Translate>
												</span>
												<span>{order.total} $</span>
											</div>
										</div>
									)}
								</article>
							);
						})}
					</div>
				)}
			</section>
		</AccountShell>
	);
}
