import { LoginUseCase } from '@auth/application';
import { AuthProvider } from '@auth/domain';
import { UnauthorizedException } from '@core/exceptions';

describe('LoginUseCase', () => {
	const strategy = { authenticate: jest.fn() };
	const factories = { getStrategy: jest.fn().mockReturnValue(strategy) };
	const useCase = new LoginUseCase(factories);

	const [provider, credentials] = [
		AuthProvider.DEFAULT,
		{ email: 'myFake@email.com', password: 'testPass' },
	];

	afterEach(() => {
		strategy.authenticate.mockClear();
		factories.getStrategy.mockClear();
	});

	it('should use the factory to get the strategy and authenticate with credentials', async () => {
		const authResult = { token: 'testToken' };

		strategy.authenticate.mockResolvedValue(authResult);

		const result = await useCase.execute({ provider, credentials });

		expect(factories.getStrategy).toHaveBeenCalledWith(provider);
		expect(strategy.authenticate).toHaveBeenCalledWith(credentials);
		expect(result).toBe(authResult);
	});

	it('should propagate errors from the strategy authenticate method', async () => {
		const error = new UnauthorizedException('Authentication failed');
		strategy.authenticate.mockRejectedValue(error);

		const executeCb = () => useCase.execute({ provider, credentials });

		await expect(executeCb).rejects.toThrow('Authentication failed');
	});
});
