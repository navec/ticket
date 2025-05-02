import { LoginUseCase } from '@auth/application';
import { AuthProvider } from '@auth/domain';
import { AuthController } from '@auth/presentations';

describe(`${AuthController.name} controller`, () => {
	const loginUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<LoginUseCase>;
	const authController = new AuthController(loginUseCase);
	const credentials = { email: 'myfake@email.com', password: 'secret' };

	afterEach(loginUseCase.execute.mockClear);

	it(`should call loginUseCase.execute with default provider and credentials`, async () => {
		loginUseCase.execute.mockResolvedValue({
			token: 'my_fake_token',
			email: credentials.email,
		});

		const result = await authController.login(credentials);

		expect(result).toEqual({
			token: 'my_fake_token',
			email: 'myfake@email.com',
		});
		expect(loginUseCase.execute).toHaveBeenCalledWith(
			AuthProvider.DEFAULT,
			credentials
		);
	});

	it('should call loginUseCase.execute with provided provider and credentials', async () => {
		const customProvider = 'CUSTOM' as AuthProvider;

		loginUseCase.execute.mockResolvedValue({
			token: 'def456',
			email: credentials.email,
		});

		const result = await authController.login(credentials, customProvider);

		expect(result).toEqual({ token: 'def456', email: 'myfake@email.com' });
		expect(loginUseCase.execute).toHaveBeenCalledWith(
			customProvider,
			credentials
		);
	});
});
