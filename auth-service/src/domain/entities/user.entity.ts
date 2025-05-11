export type User =
	| { email: string; passwordHash: string; provider: 'email-password' }
	| { email: string; passwordHash: null; provider: 'google' | string };
