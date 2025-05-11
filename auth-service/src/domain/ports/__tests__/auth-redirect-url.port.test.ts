import { AuthRedirectUrlPort } from '@auth/domain';

describe(AuthRedirectUrlPort.name, () => {
	const authRedirectUrl: jest.Mocked<AuthRedirectUrlPort> = {
		generateRedirectUrl: jest.fn(),
	};

	it('should return redirect url', async () => {
		authRedirectUrl.generateRedirectUrl.mockResolvedValueOnce(
			'https://provider.com/redirect'
		);

		const url = await authRedirectUrl.generateRedirectUrl();

		expect(url).toEqual('https://provider.com/redirect');
	});
});
