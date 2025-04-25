import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: 'cjs',
	dts: true,
	// clean: true,
	noExternal: ['@core'],
	tsconfig: './tsconfig.json',
});
