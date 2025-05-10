import { EmailPasswordAuthUseCase } from '@auth/application';

describe(EmailPasswordAuthUseCase.name, () => {
	const emailPasswordAuthService = { authenticate: jest.fn() };
	const useCase = new EmailPasswordAuthUseCase(emailPasswordAuthService);

	it('should use the factory to get the strategy and authenticate with credentials', async () => {
		const credentials = {
			email: 'fake@email.com',
			password: 'secret',
			confirmPassword: 'another_secret',
		};
		const authenticateFn = () => useCase.execute(credentials);

		expect(emailPasswordAuthService.authenticate).not.toHaveBeenCalled();
		expect(authenticateFn).rejects.toThrow(
			'Password and confirm password do not match'
		);
	});

	it('should return an email with a token', async () => {
		const credentials = {
			email: 'fake@email.com',
			password: 'secret',
			confirmPassword: 'secret',
		};

		emailPasswordAuthService.authenticate.mockResolvedValue({
			email: credentials.email,
			token: 'testToken',
		});

		const authenticate = await useCase.execute(credentials);

		expect(authenticate).toEqual({
			email: credentials.email,
			token: 'testToken',
		});
		expect(emailPasswordAuthService.authenticate).toHaveBeenCalledWith(
			credentials
		);
	});
});
