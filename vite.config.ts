import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return undefined;

					if (id.includes("react-router-dom")) return "router";
					if (id.includes("@supabase/supabase-js")) return "supabase";
					if (id.includes("country-state-city")) return "geo-data";
					if (id.includes("react") || id.includes("react-dom"))
						return "react-vendor";
					if (id.includes("@react-google-maps/api")) return "maps";

					return "vendor";
				},
			},
		},
	},
});
