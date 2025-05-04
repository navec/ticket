import { AuthProvider, AuthStrategyPort } from '@auth/domain';
import { AuthStrategyFactory } from '@auth/infrastructure';
import { NotFoundException } from '@core/exceptions';

const getAuthStrategyPort = (): AuthStrategyPort => ({
	authenticate: jest.fn(),
});

describe('AuthStrategyFactory', () => {
	const defaultAuthStrategy = getAuthStrategyPort();
	const googleAuthStrategy = getAuthStrategyPort();

	const factory = new AuthStrategyFactory(
		defaultAuthStrategy,
		googleAuthStrategy
	);

	it(`should return the ${AuthProvider.DEFAULT} strategy when provider is ${AuthProvider.DEFAULT}`, () => {
		const strategy = factory.getStrategy(AuthProvider.DEFAULT);
		expect(strategy).toBe(defaultAuthStrategy);
	});

	it(`should return the ${AuthProvider.GOOGLE} strategy when provider is ${AuthProvider.GOOGLE}`, () => {
		const strategy = factory.getStrategy(AuthProvider.GOOGLE);
		expect(strategy).toBe(googleAuthStrategy);
	});

	it('should throw NotFoundException for an unexpected provider', () => {
		const invalidProvider = 'INVALID' as AuthProvider;
		expect(() => factory.getStrategy(invalidProvider)).toThrow(
			NotFoundException
		);
	});
});
