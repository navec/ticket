import {
	AuthProvider,
	AuthStrategyFactoryPort,
	AuthStrategyPort,
} from '@auth/domain';

describe('AuthStrategyFactoryPort', () => {
	const dummyStrategy: AuthStrategyPort = {} as AuthStrategyPort;
	const factory: jest.Mocked<AuthStrategyFactoryPort> = {
		getStrategy: jest.fn(),
	};

	afterEach(factory.getStrategy.mockClear);

	it('should return a strategy for a given provider', () => {
		factory.getStrategy.mockReturnValueOnce(dummyStrategy);

		const strategy = factory.getStrategy(AuthProvider.LOCAL);

		expect(strategy).toBe(dummyStrategy);
	});

	it.each(Object.values(AuthProvider))(
		'should work consistently for %s provider',
		(provider) => {
			factory.getStrategy.mockReturnValueOnce(dummyStrategy);

			const strategy = factory.getStrategy(provider);

			expect(strategy).toBe(dummyStrategy);
		}
	);
});
