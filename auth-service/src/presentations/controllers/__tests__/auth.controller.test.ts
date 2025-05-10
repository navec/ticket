import {
	EmailPasswordAuthUseCase,
	GoogleAuthUseCase,
	GoogleRedirectUrlUseCase,
} from '@auth/application';
import { AuthController } from '@auth/presentations';

describe(`${AuthController.name} controller`, () => {
	const emailPasswordAuthUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<EmailPasswordAuthUseCase>;
	const googleRedirectUrlUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<GoogleRedirectUrlUseCase>;
	const googleAuthUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<GoogleAuthUseCase>;

	const authController = new AuthController(
		emailPasswordAuthUseCase,
		googleRedirectUrlUseCase,
		googleAuthUseCase
	);

	it(`should call emailPasswordAuthUseCase.execute with email and password`, async () => {
		const credentials = {
			email: 'myfake@email.com',
			password: 'secret',
			confirmPassword: 'secret',
		};
		const emailWithToken = {
			email: credentials.email,
			token: 'my_fake_token',
		};
		emailPasswordAuthUseCase.execute.mockResolvedValue(emailWithToken);

		const result = await authController.loginByEmailPassword(credentials);

		expect(result).toEqual(emailWithToken);
		expect(emailPasswordAuthUseCase.execute).toHaveBeenCalledWith(credentials);
	});

	it(`should return url for google provider`, async () => {
		const redirectUrl = 'https://provider.com/redirect';
		googleRedirectUrlUseCase.execute.mockResolvedValue(redirectUrl);

		const result = await authController.urlRedirectToGoogle();

		expect(result).toEqual(redirectUrl);
		expect(googleRedirectUrlUseCase.execute).toHaveBeenCalled();
	});

	it(`should call emailPasswordAuthUseCase.execute with google provider code`, async () => {
		const emailWithToken = { email: 'user@email.com', token: 'my_fake_token' };
		const providerCode = { code: 'my_fake_code' };
		googleAuthUseCase.execute.mockResolvedValue(emailWithToken);

		const result = await authController.loginByGoogleCode(providerCode);

		expect(result).toEqual(emailWithToken);
		expect(googleAuthUseCase.execute).toHaveBeenCalledWith(providerCode);
	});
});
