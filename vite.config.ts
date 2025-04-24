import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: ['**/__tests__/*.{test,spec}.ts'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		environment: 'node',
		coverage: {
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
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
