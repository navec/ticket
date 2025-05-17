import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testMatch: [
		'**/__tests__/**/*.test.[jt]s?(x)',
		'**/features/**/*.test.[jt]s?(x)',
		'**/e2e/**/*.test.[jt]s?(x)',
	],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	modulePaths: ['<rootDir>'],
	collectCoverage: false,

	coverageReporters: ['text', 'lcov'],
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 85,
			lines: 90,
			statements: 90,
		},
	},
};

export default config;
