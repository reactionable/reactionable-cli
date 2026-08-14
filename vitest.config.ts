import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			include: ["src/**/*.{ts,tsx,js,jsx}"],
			exclude: [
				"src/**/*.template.ts",
				"src/templates/**",
				"src/index.ts",
				"src/**/container.ts",
			],
			provider: "v8",
		},
		environment: "node",
		globals: true,
	},
});
