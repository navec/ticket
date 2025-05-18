import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { env } from 'node:process';

import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
} from '@ticket/core';

import { ALGORITHM, ENCODING, JwtServicePort } from '@auth/domain';
import { JWT_SERVICE } from '@auth/shared';
import {
	base64UrlDecode,
	base64UrlEncode,
	JwtHeader,
	JwtPayload,
} from '@auth/infrastructure';

@Injectable(JWT_SERVICE)
export class JwtService implements JwtServicePort {
	private readonly revokedJtiSet = new Set<string>();
	private readonly activeTokens = new Map<string, string>();
	private readonly DEFAULT_ACCESS_EXP = 300; // 5 min
	private readonly DEFAULT_REFRESH_EXP = 86400; // 24h
	private readonly secret = env.JWT_SECRET_V1 ?? 'secret';

	private signData(data: string, secret: string): string {
		return createHmac(ALGORITHM.SHA256, secret)
			.update(data)
			.digest(ENCODING.BASE_64_URL);
	}

	sign({
		payload,
		expiresInSec,
		isRefreshToken,
	}: {
		payload: Record<string, unknown>;
		expiresInSec?: number;
		isRefreshToken?: boolean;
	}): string {
		const sub = payload['sub']?.toString() ?? ''; // Should be user id or uuid
		if (this.activeTokens.has(sub)) {
			return this.activeTokens.get(sub)!;
		}

		const expirationDuration = isRefreshToken
			? this.DEFAULT_ACCESS_EXP
			: this.DEFAULT_REFRESH_EXP;

		const iat = Math.floor(Date.now() / 1000);
		const exp = iat + (expiresInSec ?? expirationDuration);
		const jti = randomUUID();
		const typ = isRefreshToken ? 'refresh' : 'access';

		const header = { alg: 'HS256', typ: 'JWT' };
		const fullPayload = { ...payload, iat, exp, jti, sub, typ };

		const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
		const encodedPayload = base64UrlEncode(
			Buffer.from(JSON.stringify(fullPayload))
		);

		const data = `${encodedHeader}.${encodedPayload}`;
		const token = `${data}.${this.signData(data, this.secret)}`;

		this.activeTokens.set(sub, token);
		return token;
	}

	private decode(token: string): {
		header: JwtHeader;
		payload: JwtPayload;
		signature: string;
	} {
		const [encodedHeader, encodedPayload, signature] = token.split('.');
		if (!encodedHeader || !encodedPayload || !signature) {
			throw new BadRequestException('Malformed token');
		}

		const header = JSON.parse(base64UrlDecode(encodedHeader).toString());
		const payload = JSON.parse(base64UrlDecode(encodedPayload).toString());

		return { header, payload, signature };
	}

	isRevoked(jti: string): boolean {
		return this.revokedJtiSet.has(jti);
	}

	verify(token: string): JwtPayload {
		const { header, payload, signature } = this.decode(token);

		// const secret = this.secretMap[header.kid];
		// if (!secret) {
		// 	throw new UnauthorizedException('Unknown signing key');
		// }

		const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
		const encodedPayload = base64UrlEncode(
			Buffer.from(JSON.stringify(payload))
		);
		const expectedSignature = Buffer.from(
			this.signData(`${encodedHeader}.${encodedPayload}`, this.secret) // Use kid secret instead of default secret
		);
		if (!timingSafeEqual(Buffer.from(signature), expectedSignature)) {
			throw new UnauthorizedException('Invalid signature');
		}

		const nowInSec = Math.floor(Date.now() / 1000);
		if (payload.exp < nowInSec) {
			throw new UnauthorizedException('Token expired');
		}

		if (this.isRevoked(payload.jti)) {
			throw new UnauthorizedException('Token revoked');
		}

		return payload;
	}

	revoke({ jti, sub }: { jti: string; sub: string }): void {
		this.activeTokens.delete(sub);
		this.revokedJtiSet.add(jti);
	}

	refreshToken(token: string): string {
		const payload = this.verify(token);
		if (payload.typ !== 'refresh') {
			throw new UnauthorizedException('Invalid token type');
		}

		this.revoke(payload); // Revoke old token
		return this.sign({ payload });
	}
}
