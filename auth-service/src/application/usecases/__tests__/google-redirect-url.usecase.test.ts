import { GoogleRedirectUrlUseCase } from '@auth/application';

describe(GoogleRedirectUrlUseCase.name, () => {
	const googleAuthRedirectUrl = { generateRedirectUrl: jest.fn() };
	const useCase = new GoogleRedirectUrlUseCase(googleAuthRedirectUrl);

	it('should call generateRedirectUrl', async () => {
		const redirectUrl = 'https://provider.com/redirect';
		googleAuthRedirectUrl.generateRedirectUrl.mockResolvedValue(redirectUrl);

		const result = await useCase.execute();

		expect(result).toEqual(redirectUrl);
		expect(googleAuthRedirectUrl.generateRedirectUrl).toHaveBeenCalled();
	});

	it('should throw an error if generateRedirectUrl fails', async () => {
		googleAuthRedirectUrl.generateRedirectUrl.mockRejectedValue(
			new Error('Failed to generate redirect URL')
		);

		const excuteFn = () => useCase.execute();

		await expect(excuteFn).rejects.toThrow('Failed to generate redirect URL');
	});
});
