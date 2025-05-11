import { GoogleAuthRedirectUrlService } from '@auth/infrastructure';

const mockGenerateAuthUrl = jest.fn();

jest.mock('@auth/infrastructure', () => ({
	...jest.requireActual('@auth/infrastructure'),
	googleClient: {
		generateAuthUrl: (...args: unknown[]) => mockGenerateAuthUrl(...args),
	},
}));

describe(GoogleAuthRedirectUrlService.name, () => {
	const googleAuthRedirectUrlService = new GoogleAuthRedirectUrlService();

	it('should generate redirect url', async () => {
		const expected = 'https://accounts.google.com/o/oauth2/v2/auth';
		mockGenerateAuthUrl.mockReturnValueOnce(expected);

		const redirectUrl =
			await googleAuthRedirectUrlService.generateRedirectUrl();

		expect(redirectUrl).toEqual(expected);
	});
});
