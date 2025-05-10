import { JwtService } from '../jwt.service';

describe(JwtService.name, () => {
	const jwtService = new JwtService();

	it('should sign and verify an access token', () => {
		const payload = { sub: 'userId', roles: ['admin'] };

		const token = jwtService.sign({ payload, expiresInSec: 100 });
		const verified = jwtService.verify(token);

		expect(verified).toHaveProperty('iat');
		expect(verified).toHaveProperty('exp');
		expect(verified).toHaveProperty('jti');
		expect(verified).toMatchObject({
			sub: 'userId',
			roles: ['admin'],
			typ: 'access',
		});
	});

	it('should sign and verify a refresh token', () => {
		const token = jwtService.sign({
			payload: { sub: 'user_id_2' },
			expiresInSec: 100,
			isRefreshToken: true,
		});
		const verified = jwtService.verify(token);

		expect(verified).toMatchObject({ sub: 'user_id_2', typ: 'refresh' });
	});

	it('should throw an error for a malformed token', () => {
		const verifyCb = () => jwtService.verify('invalid.token');

		expect(verifyCb).toThrow('Malformed token');
	});

	it('should throw an error for an invalid signature', () => {
		const [headers, payload, signature] = jwtService
			.sign({ payload: { sub: 'user3' } })
			.split('.');
		const reverseSignature = signature.split('').reverse().join('');

		const verifyCb = () =>
			jwtService.verify(`${headers}.${payload}.${reverseSignature}`);

		expect(verifyCb).toThrow('Invalid signature');
	});

	it('should throw an error when the token is expired', () => {
		try {
			jest.useFakeTimers();

			const token = jwtService.sign({
				payload: { sub: 'user4' },
				expiresInSec: 1,
			});
			jest.advanceTimersByTime(2000);
			const verifyCb = () => jwtService.verify(token);

			expect(verifyCb).toThrow('Token expired');
		} finally {
			jest.useRealTimers();
		}
	});

	it('should revoke a token', () => {
		const token = jwtService.sign({
			payload: { sub: 'user5' },
			expiresInSec: 100,
		});

		const verified = jwtService.verify(token);
		jwtService.revoke({ jti: verified.jti, sub: verified.sub });
		const verifyCb = () => jwtService.verify(token);

		expect(verifyCb).toThrow('Token revoked');
	});

	it('should refresh a refresh token and revoke the old token', () => {
		const token = jwtService.sign({
			payload: { sub: 'user6' },
			expiresInSec: 100,
			isRefreshToken: true,
		});
		const verifyToken = jwtService.verify(token);

		const newToken = jwtService.refreshToken(token);
		const newVerifyToken = jwtService.verify(newToken);
		const verifyCb = () => jwtService.verify(token);

		expect(newVerifyToken.sub).toBe('user6');
		expect(newVerifyToken.jti).not.toBe(verifyToken.jti);
		expect(verifyCb).toThrow('Token revoked');
	});

	it('should throw an error when refreshing a non-refresh token', () => {
		const token = jwtService.sign({
			payload: { sub: 'user6' },
			expiresInSec: 100,
		});
		const verifyCb = () => jwtService.refreshToken(token);

		expect(verifyCb).toThrow('Invalid token type');
	});
});
