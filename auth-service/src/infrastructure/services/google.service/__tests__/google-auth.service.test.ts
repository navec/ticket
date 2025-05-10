import { JwtServicePort, UserRepositoryPort } from '@auth/domain';
import { GoogleAuthService } from '@auth/infrastructure';

const mockGetToken = jest.fn();
const mockVerifyIdToken = jest.fn();

jest.mock('@auth/infrastructure', () => ({
	...jest.requireActual('@auth/infrastructure'),
	googleClient: {
		getToken: (code: string) => mockGetToken(code),
		verifyIdToken: (...args: unknown[]) => mockVerifyIdToken(...args),
	},
}));

describe(GoogleAuthService.name, () => {
	const userRepository: jest.Mocked<UserRepositoryPort> = {
		findByEmail: jest.fn(),
		create: jest.fn(),
	};
	const jwtService: jest.Mocked<JwtServicePort> = {
		sign: jest.fn(),
		verify: jest.fn(),
		refreshToken: jest.fn(),
		isRevoked: jest.fn(),
		revoke: jest.fn(),
	};

	const googleAuthService = new GoogleAuthService(userRepository, jwtService);

	it('should throw an exception when google email is missing', async () => {
		const credentials = { code: 'fake_code' };
		mockGetToken.mockResolvedValueOnce({ tokens: 'fake_token' });
		mockVerifyIdToken.mockResolvedValueOnce({
			getPayload: () => ({
				email_verified: true,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
		});

		const authenticateFn = () => googleAuthService.authenticate(credentials);

		expect(authenticateFn).rejects.toThrow(
			'Google e-mail is missing or invalid'
		);
	});

	it('should throw an exception when google email verified is false', async () => {
		const credentials = { code: 'fake_code' };
		mockGetToken.mockResolvedValueOnce({ tokens: 'fake_token' });
		mockVerifyIdToken.mockResolvedValueOnce({
			getPayload: () => ({
				email: 'fake@email.com',
				email_verified: false,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
		});

		const authenticateFn = () => googleAuthService.authenticate(credentials);

		expect(authenticateFn).rejects.toThrow(
			'Google e-mail is missing or invalid'
		);
	});

	it('should throw an exception when google token is not defined', async () => {
		const credentials = { code: 'fake_code' };
		mockGetToken.mockResolvedValueOnce({ tokens: 'fake_token' });
		mockVerifyIdToken.mockResolvedValueOnce({
			getPayload: () => ({ email: 'fake@email.com', email_verified: true }),
		});

		const authenticateFn = () => googleAuthService.authenticate(credentials);

		expect(authenticateFn).rejects.toThrow(
			'Google e-mail is missing or invalid'
		);
	});

	it('should throw an exception when google token is expired', async () => {
		const credentials = { code: 'fake_code' };
		mockGetToken.mockResolvedValueOnce({ tokens: 'fake_token' });
		mockVerifyIdToken.mockResolvedValueOnce({
			getPayload: () => ({
				email: 'fake@email.com',
				email_verified: true,
				exp: Math.floor(Date.now() / 1000) - 3600,
			}),
		});

		const authenticateFn = () => googleAuthService.authenticate(credentials);

		expect(authenticateFn).rejects.toThrow('Google token is expired');
	});

	it('should return email with token', async () => {
		const email = 'fake@email.com';
		userRepository.findByEmail.mockResolvedValueOnce({
			email,
			passwordHash: null,
			provider: 'google',
		});
		jwtService.sign.mockReturnValueOnce('fake_token');
		mockGetToken.mockResolvedValueOnce({ tokens: 'fake_token' });
		mockVerifyIdToken.mockResolvedValueOnce({
			getPayload: () => ({
				email,
				email_verified: true,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
		});

		const emailWithToken = await googleAuthService.authenticate({
			code: 'fake_code',
		});

		expect(emailWithToken).toEqual({
			email: 'fake@email.com',
			token: 'fake_token',
		});
		expect(userRepository.create).not.toHaveBeenCalled();
	});

	it("should return the email with the token and create the user if it doesn't exist", async () => {
		userRepository.findByEmail.mockResolvedValueOnce(null);
		jwtService.sign.mockReturnValueOnce('fake_token');
		mockGetToken.mockResolvedValueOnce({ tokens: 'fake_token' });
		mockVerifyIdToken.mockResolvedValueOnce({
			getPayload: () => ({
				email: 'fake@email.com',
				email_verified: true,
				exp: Math.floor(Date.now() / 1000) + 3600,
			}),
		});

		const emailWithToken = await googleAuthService.authenticate({
			code: 'fake_code',
		});

		expect(emailWithToken).toEqual({
			email: 'fake@email.com',
			token: 'fake_token',
		});
	});
});
