import { JwtServicePort, UserRepositoryPort } from '@auth/domain';
import { DefaultAuthStrategy } from '@auth/infrastructure';

describe(DefaultAuthStrategy.name, () => {
	const userRepository: jest.Mocked<UserRepositoryPort> = {
		findByEmail: jest.fn(),
	};
	const jwtService: jest.Mocked<JwtServicePort> = {
		sign: jest.fn(),
		verify: jest.fn(),
		refreshToken: jest.fn(),
		isRevoked: jest.fn(),
		revoke: jest.fn(),
	};
	const authStrategy: DefaultAuthStrategy = new DefaultAuthStrategy(
		userRepository,
		jwtService
	);

	describe('authenticate', () => {
		it('should throw an error if the user is not found', async () => {
			const credentials = { email: 'test@example.com', password: 'secret' };
			userRepository.findByEmail.mockResolvedValue(null);

			const authenticateCb = () => authStrategy.authenticate(credentials);

			await expect(authenticateCb).rejects.toThrow();
		});

		it('should throw an error if the password is invalid', async () => {
			const email = 'user@example.com';
			const passwordHash =
				'0ef5928305faf03f0a83ed5d747fed0fa2033f3452125a971c457b0cab404bfd';
			userRepository.findByEmail.mockResolvedValueOnce({ email, passwordHash });

			const authenticateCb = () =>
				authStrategy.authenticate({ email, password: 'wrong' });

			await expect(authenticateCb).rejects.toThrow('Invalid credentials');
		});

		it('should return a token and email on successful authentication', async () => {
			const email = 'user@example.com';
			const passwordHash =
				'3881219d087dd9c634373fd33dfa33a2cb6bfc6c520b64b8bb60ef2ceb534ae7';

			userRepository.findByEmail.mockResolvedValue({ email, passwordHash });
			jwtService.sign.mockReturnValue('validToken');

			const result = await authStrategy.authenticate({
				email,
				password: 'secret',
			});

			expect(result).toEqual({ email, token: 'validToken' });
			expect(jwtService.sign).toHaveBeenCalledWith({
				payload: { email },
			});
		});
	});
});
