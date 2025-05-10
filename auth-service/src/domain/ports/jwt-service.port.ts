export abstract class JwtServicePort {
	abstract sign(params: {
		payload: Record<string, unknown>;
		expiresInSec?: number;
		isRefreshToken?: boolean;
	}): string;
	abstract verify(token: string): Record<string, unknown>;
	abstract refreshToken(token: string): string;
	abstract revoke(ids: { jti: string; sub: string }): void;
	abstract isRevoked(jti: string): boolean;
}
