import { GoogleAuthStrategy } from '@auth/infrastructure';

describe(GoogleAuthStrategy.name, () => {
	const googleAuthStrategy = new GoogleAuthStrategy();

	it('authenticate should throw NotImplementedException', async () => {
		const credentials = { email: 'myFake@email.com', password: 'secret' };

		const authenticateCb = () => googleAuthStrategy.authenticate(credentials);

		expect(authenticateCb).toThrow('Method not implemented.');
	});
});
