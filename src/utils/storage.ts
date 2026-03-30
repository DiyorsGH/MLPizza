export const GUEST_STORAGE_SCOPE = "guest";

export function getStorageScope(userId?: string | null) {
	return userId ? `user:${userId}` : GUEST_STORAGE_SCOPE;
}

export function getCartStorageKey(scope: string) {
	return `cart:${scope}`;
}

export function getOrdersStorageKey(scope: string) {
	return `orders:${scope}`;
}

export function readStorageJson<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch (error) {
		console.error(`Failed to read localStorage key "${key}"`, error);
		return fallback;
	}
}

export function writeStorageJson<T>(key: string, value: T) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Failed to write localStorage key "${key}"`, error);
	}
}
