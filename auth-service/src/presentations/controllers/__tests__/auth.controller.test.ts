import { LoginUseCase } from '@auth/application';
import { AuthProvider } from '@auth/domain';
import { AuthController, LoginDto } from '@auth/presentations';

describe(`${AuthController.name} controller`, () => {
	const loginUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<LoginUseCase>;
	const authController = new AuthController(loginUseCase);

	afterEach(loginUseCase.execute.mockClear);

	it(`should call loginUseCase.execute with default provider and credentials`, async () => {
		const { provider, credentials } = {
			provider: AuthProvider.DEFAULT,
			credentials: { email: 'myfake@email.com', password: 'secret' },
		} as const;

		loginUseCase.execute.mockResolvedValue({
			token: 'my_fake_token',
			email: credentials.email,
		});

		const result = await authController.login({
			provider,
			credentials,
		} as LoginDto);

		expect(result).toEqual({
			token: 'my_fake_token',
			email: 'myfake@email.com',
		});
		expect(loginUseCase.execute).toHaveBeenCalledWith({
			provider: AuthProvider.DEFAULT,
			credentials,
		});
	});

	it('should call loginUseCase.execute with provided provider and credentials', async () => {
		const { provider, credentials } = {
			provider: AuthProvider.GOOGLE,
			credentials: { code: 'fake_code' },
		} as const;

		loginUseCase.execute.mockResolvedValue({
			token: 'def456',
			email: 'provider@email.com',
		});

		const result = await authController.login({
			provider,
			credentials,
		} as LoginDto);

		expect(result).toEqual({ token: 'def456', email: 'provider@email.com' });
		expect(loginUseCase.execute).toHaveBeenCalledWith({
			provider,
			credentials,
		});
	});
});
