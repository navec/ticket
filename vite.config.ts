import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: ['**/__tests__/*.{test,spec}.ts'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/coverage/**',
				'**/.prettierrc.js',
				'**/*.config.{ts,js}',
			],
		},
	},
});
