import { User } from '@auth/domain';

export const DEFAULT_USERS: User[] = [
	{
		email: 'fake@email.com',
		passwordHash:
			'd71336187241e64bd023e351053dab4c84f2b9a7766671da854b2ea14683dd6b',
		provider: 'email-password',
	},
];
