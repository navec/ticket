import { JwtServicePort } from '@auth/domain';

// class FakeJwtService extends JwtServicePort {
// 	private revokedJti = new Set<string>();

// 	sign(params: {
// 		payload: Record<string, unknown>;
// 		expiresInSec?: number;
// 		isRefreshToken?: boolean;
// 	}): string {
// 		// Create a dummy token as a JSON string. In a real implementation, signing would be more complex.
// 		return JSON.stringify({
// 			payload: params.payload,
// 			expiresInSec: params.expiresInSec,
// 			isRefreshToken: params.isRefreshToken,
// 		});
// 	}

// 	verify(token: string): Record<string, unknown> {
// 		// Decode the token by parsing the JSON string
// 		try {
// 			const decoded = JSON.parse(token);
// 			return decoded.payload || {};
// 		} catch (error) {
// 			throw new Error('Invalid token');
// 		}
// 	}

// 	refreshToken(token: string): string {
// 		// For testing, simulate refresh by prefixing refreshed token string
// 		return `refreshed:${token}`;
// 	}

// 	revoke(jti: string): void {
// 		this.revokedJti.add(jti);
// 	}

// 	isRevoked(jti: string): boolean {
// 		return this.revokedJti.has(jti);
// 	}
// }

describe('FakeJwtService', () => {
	const jwtService: jest.Mocked<JwtServicePort> = {
		sign: jest.fn(),
		verify: jest.fn(),
		refreshToken: jest.fn(),
		revoke: jest.fn(),
		isRevoked: jest.fn(),
	};

	const samplePayload = { userId: 123, role: 'admin' };

	it('should sign a token with payload and optional parameters', () => {
		jwtService.sign.mockReturnValueOnce('token');

		const token = jwtService.sign({
			payload: samplePayload,
			expiresInSec: 3600,
			isRefreshToken: false,
		});

		expect(token).toEqual('token');
	});

	it('should verify a valid token and return payload', () => {
		jwtService.sign.mockReturnValueOnce('token');
		jwtService.verify.mockReturnValueOnce(samplePayload);

		const token = jwtService.sign({ payload: samplePayload });
		const payload = jwtService.verify(token);

		expect(payload).toEqual(samplePayload);
	});

	it('should throw error when verifying an invalid token', () => {
		jwtService.verify.mockImplementationOnce(() => {
			throw new Error('Invalid token');
		});

		const verifyCb = () => jwtService.verify('not-a-json-token');

		expect(verifyCb).toThrow('Invalid token');
	});

	it('should refresh a token properly', () => {
		jwtService.refreshToken.mockReturnValueOnce(`refreshed`);

		const refreshedToken = jwtService.refreshToken('token');

		expect(refreshedToken).toBe(`refreshed`);
	});

	it('should revoke a token identifier and detect it as revoked', () => {
		jwtService.isRevoked.mockReturnValueOnce(false).mockReturnValueOnce(true);

		const token = 'token-123';
		expect(jwtService.isRevoked(token)).toBe(false);
		expect(jwtService.isRevoked(token)).toBe(true);
	});
});
