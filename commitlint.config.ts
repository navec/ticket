import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'subject-min-length': [2, 'always', 10],
	},
};

export default config;
