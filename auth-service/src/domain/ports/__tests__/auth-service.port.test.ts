import { AuthServicePort } from '@auth/domain';
import { UnauthorizedException } from '@ticket/core';

describe(AuthServicePort.name, () => {
	const credentials = { email: 'user@example.com', password: 'password123' };
	const authService: jest.Mocked<AuthServicePort> = { authenticate: jest.fn() };

	afterEach(authService.authenticate.mockClear);

	it('should resolve authentication with provided credentials', async () => {
		authService.authenticate.mockResolvedValueOnce({
			token: 'fake_token',
			email: credentials.email,
		});

		const result = await authService.authenticate(credentials);

		expect(result).toEqual({ email: 'user@example.com', token: 'fake_token' });
	});

	it('should propagate errors from the authenticate method', async () => {
		const error = new UnauthorizedException('Authentication failed');
		authService.authenticate.mockRejectedValueOnce(error);

		const strategyCb = () => authService.authenticate(credentials);

		await expect(strategyCb).rejects.toThrow('Authentication failed');
	});
});
