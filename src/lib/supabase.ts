// supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function ensureCurrentUserProfile() {
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError) throw authError;
	if (!user) return null;

	const username =
		user.user_metadata?.username || user.user_metadata?.user_name || user.email;

	if (!username) return null;

	const { data: existingProfile, error: profileError } = await supabase
		.from("profiles")
		.select("id, username")
		.eq("id", user.id)
		.maybeSingle();

	if (profileError) throw profileError;

	if (existingProfile) return existingProfile;

	const { data: insertedProfile, error: insertError } = await supabase
		.from("profiles")
		.upsert({ id: user.id, username }, { onConflict: "id" })
		.select("id, username")
		.single();

	if (insertError) {
		console.error("PROFILE UPSERT ERROR:", insertError);
		throw insertError;
	}

	return insertedProfile;
}
// Signup function
export async function signUp(
	email: string,
	password: string,
	username: string,
) {
	if (!email || !password || !username)
		throw new Error("Email, password, and username are required.");

	// check if username exists
	const { data: existing } = await supabase
		.from("profiles")
		.select("username")
		.eq("username", username)
		.single();

	if (existing) throw new Error("Username already taken.");

	// create auth user
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: window.location.origin + "/",
			data: { username },
		},
	});

	if (error || !data.user) throw error;

	return data.user;
}

// Login function
// export async function login(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//     });
//     if (error) throw error;

//     if (!data.user?.email_confirmed_at)
//         throw new Error("Please confirm your email before logging in.");

//     return data.user;
// }
export async function login(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;

	await ensureCurrentUserProfile();

	return data.user;
}

// Logout
export async function logout() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}

// Get current user with username
export async function getCurrentUser() {
	const { data } = await supabase.auth.getUser();
	const user = data.user;
	if (!user) return null;

	try {
		await ensureCurrentUserProfile();
	} catch (error) {
		console.error("ENSURE PROFILE ERROR:", error);
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", user.id)
		.maybeSingle(); // ✅ instead of single()

	return {
		id: user.id,
		email: user.email!,
		username: profile?.username || user.email, // ✅ fallback
	};
}
