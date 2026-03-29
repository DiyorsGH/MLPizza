export async function getUserCountry() {
	try {
		const res = await fetch("https://ipapi.co/json/");
		const data = await res.json();

		return {
			country: data.country_code,
			city: data.city,
			lat: data.latitude,
			lon: data.longitude,
		};
	} catch {
		return null;
	}
}
