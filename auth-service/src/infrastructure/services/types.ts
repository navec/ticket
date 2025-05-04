export type JwtHeader = {
	alg: string;
	typ: string;
	kid?: string; // TODO make it required
};

export type JwtPayload = Record<string, unknown> & {
	iat: number;
	exp: number;
	sub: string;
	jti: string;
};
