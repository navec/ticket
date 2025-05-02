import { base64UrlEncode, base64UrlDecode } from '../utils';

describe('base64UrlEncode', () => {
	it('should encode a Buffer to a base64 URL-safe string', () => {
		const input = Buffer.from('Hello, world!'); // "SGVsbG8sIHdvcmxkIQ=="
		const encoded = base64UrlEncode(input);
		expect(encoded).toBe('SGVsbG8sIHdvcmxkIQ');
	});

	it('should remove padding characters', () => {
		const input = Buffer.from('test'); // "dGVzdA=="
		const encoded = base64UrlEncode(input);
		expect(encoded).toBe('dGVzdA');
	});
});

describe('base64UrlDecode', () => {
	it('should decode a base64 URL-safe string back to original Buffer', () => {
		const original = Buffer.from('Hello, world!');
		const encoded = base64UrlEncode(original);

		const decoded = base64UrlDecode(encoded);

		expect(original).toEqual(decoded);
	});

	it('should correctly pad the input if necessary', () => {
		const encoded = 'dGVzdA';
		const decoded = base64UrlDecode(encoded);
		expect(decoded.toString()).toBe('test');
	});
});
