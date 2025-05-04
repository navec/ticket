import { ENCODING } from '@auth/domain';

export const base64UrlEncode = (buffer: Buffer): string =>
	buffer
		.toString(ENCODING.BASE_64)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

export const base64UrlDecode = (data: string): Buffer => {
	const base64 = data
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.padEnd(data.length + ((4 - (data.length % 4)) % 4), '=');
	return Buffer.from(base64, ENCODING.BASE_64);
};
