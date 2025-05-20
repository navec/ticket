import { AuthServicePort } from '@auth/domain/ports/AuthServicePort';
import { Injectable } from '@ticket/core';
import { config } from '@gateway/config';

@Injectable('HttpAuthService')
export class HttpAuthService extends AuthServicePort {
	private url = `${config.services.auth.url}`;

	async login(credentials: {
		email: string;
		password: string;
	}): Promise<unknown> {
		return fetch(`${this.url}/login`, {
			method: 'post',
			body: JSON.stringify(credentials),
		}).then((res) => res.json());
	}
}
