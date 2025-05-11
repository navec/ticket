import { GoogleAuthUseCase } from '@auth/application';

describe(GoogleAuthUseCase.name, () => {
	const googleAuthService = { authenticate: jest.fn() };
	const useCase = new GoogleAuthUseCase(googleAuthService);

	it('should call googleAuthService.authenticate with google code', async () => {
		const credentials = { code: 'my_fake_code' };
		const emailWithToken = { email: 'fake@email.com', token: 'my_fake_token' };
		googleAuthService.authenticate.mockResolvedValue(emailWithToken);

		const result = await useCase.execute(credentials);

		expect(result).toEqual(emailWithToken);
		expect(googleAuthService.authenticate).toHaveBeenCalledWith(credentials);
	});
});
