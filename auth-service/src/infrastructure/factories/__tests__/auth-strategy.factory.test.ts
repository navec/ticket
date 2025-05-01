import { AuthProvider, AuthStrategyPort } from '@auth/domain';
import { AuthStrategyFactory } from '@auth/infrastructure';
import { NotFoundException } from '@core/exceptions';

const getAuthStrategyPort = (): AuthStrategyPort => ({
	authenticate: jest.fn(),
});

describe('AuthStrategyFactory', () => {
	const localAuthStrategy = getAuthStrategyPort();
	const googleAuthStrategy = getAuthStrategyPort();
	const jwtAuthStrategy = getAuthStrategyPort();

	const factory = new AuthStrategyFactory(
		localAuthStrategy,
		googleAuthStrategy,
		jwtAuthStrategy
	);

	it(`should return the ${AuthProvider.LOCAL} strategy when provider is ${AuthProvider.LOCAL}`, () => {
		const strategy = factory.getStrategy(AuthProvider.LOCAL);
		expect(strategy).toBe(localAuthStrategy);
	});

	it(`should return the ${AuthProvider.GOOGLE} strategy when provider is ${AuthProvider.GOOGLE}`, () => {
		const strategy = factory.getStrategy(AuthProvider.GOOGLE);
		expect(strategy).toBe(googleAuthStrategy);
	});

	it(`should return the ${AuthProvider.GOOGLE} strategy when provider is ${AuthProvider.JWT}`, () => {
		const strategy = factory.getStrategy(AuthProvider.JWT);
		expect(strategy).toBe(jwtAuthStrategy);
	});

	it('should throw NotFoundException for an unexpected provider', () => {
		const invalidProvider = 'INVALID' as AuthProvider;
		expect(() => factory.getStrategy(invalidProvider)).toThrow(
			NotFoundException
		);
	});
});
