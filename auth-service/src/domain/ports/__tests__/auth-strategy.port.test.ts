import { AuthStrategyPort } from '@auth/domain';
import { UnauthorizedException } from '@core/exceptions';

describe(AuthStrategyPort.name, () => {
	const credentials = { email: 'user@example.com', password: 'password123' };
	const strategy: jest.Mocked<AuthStrategyPort> = { authenticate: jest.fn() };

	afterEach(strategy.authenticate.mockClear);

	it('should resolve authentication with provided credentials', async () => {
		strategy.authenticate.mockResolvedValueOnce({
			token: 'fake_token',
			email: credentials.email,
		});

		const result = await strategy.authenticate(credentials);

		expect(result).toEqual({ email: 'user@example.com', token: 'fake_token' });
	});

	it('should propagate errors from the authenticate method', async () => {
		const error = new UnauthorizedException('Authentication failed');
		strategy.authenticate.mockRejectedValueOnce(error);

		const strategyCb = () => strategy.authenticate(credentials);

		await expect(strategyCb).rejects.toThrow('Authentication failed');
	});
});
