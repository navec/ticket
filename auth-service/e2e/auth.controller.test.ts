import request from 'supertest';
import { Server } from 'node:http';
import sinon from 'sinon';

import { ValidatorType } from '@ticket/core';

import { AppModule } from '@auth/app.module';
import { AuthController } from '@auth/presentations';
import { TestingModule } from './utils/TestingModule';
import { OAuth2Client } from 'google-auth-library';

describe(`${AuthController.name} (e2e)`, () => {
	let app: TestingModule;
	let server: Server;

	beforeAll(async () => {
		app = new TestingModule(AppModule);
		await app.init({ validator: ValidatorType.ZOD });

		server = app.getInstance<Server>();
	});

	describe('/auth/email-password (POST)', () => {
		const endpoint = '/auth/email-password';

		it('should throw an exception when no data is sent', async () => {
			const response = await request(server).post(endpoint);

			expect(response.status).toEqual(400);
			expect(response.body.message).toEqual(
				'email: Required - password: Required - confirmPassword: Required'
			);
		});

		it('should throw an exception when password is not valid', async () => {
			const response = await request(server).post(endpoint).send({
				email: 'fake@email.com',
				password: 'secret',
				confirmPassword: 'secret',
			});

			expect(response.status).toEqual(400);
			expect(response.body.message).toEqual(
				'password: String must contain at least 8 character(s) - confirmPassword: String must contain at least 8 character(s)'
			);
		});

		it('should throw an exception when password and confirmPassword is different', async () => {
			const response = await request(server).post(endpoint).send({
				email: 'fake@email.com',
				password: 'HpD%?secret',
				confirmPassword: 'secretRP%?dH',
			});

			expect(response.status).toEqual(400);
			expect(response.body.message).toEqual(
				'Password and confirmPassword do not match'
			);
		});

		it('should throw an exception when credential is not valid', async () => {
			const response = await request(server).post(endpoint).send({
				email: 'fake@email.com',
				password: 'HpD%?secret',
				confirmPassword: 'HpD%?secret',
			});

			expect(response.status).toEqual(401);
			expect(response.body.message).toEqual('Invalid credentials');
		});

		it('should return valid credential', async () => {
			const response = await request(server).post(endpoint).send({
				email: 'fake@email.com',
				password: 'Test+1234',
				confirmPassword: 'Test+1234',
			});

			expect(response.status).toEqual(200);
			expect(response.body.email).toEqual('fake@email.com');
			expect(response.body).toHaveProperty('token');
		});
	});

	describe('/auth/google/redirect (GET)', () => {
		const endpoint = '/auth/google/redirect';

		it('should return a redirect URL', async () => {
			const response = await request(server).get(endpoint).send({
				email: 'fake@email.com',
				password: 'Test+1234',
				confirmPassword: 'Test+1234',
			});

			expect(response.status).toEqual(200);
			expect(response.body).toEqual(
				'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=openid%20email%20profile&response_type=code&client_id=&redirect_uri='
			);
		});
	});

	describe('/auth/google/callback (GET)', () => {
		const endpoint = '/auth/google/callback';

		afterEach(() => {
			sinon.restore();
		});

		it('should throw an exception when no data is sent', async () => {
			const response = await request(server).get(endpoint);

			expect(response.status).toEqual(400);
			expect(response.body.message).toEqual('code: Required');
		});

		it('should throw an exception when no email found in google payload', async () => {
			sinon.stub(OAuth2Client.prototype, 'getToken').resolves({
				tokens: {
					id_token: 'fake-id-token',
					access_token: 'fake-access-token',
				},
			});

			sinon
				.stub(OAuth2Client.prototype, 'verifyIdToken')
				.resolves({ getPayload: () => {} });

			const response = await request(server)
				.get(endpoint)
				.query({ code: 'fake-code' });

			expect(response.status).toEqual(401);
			expect(response.body.message).toEqual(
				'Google e-mail is missing or invalid'
			);
		});

		it('should throw an exception when token is expired', async () => {
			sinon.stub(OAuth2Client.prototype, 'getToken').resolves({
				tokens: {
					id_token: 'fake-id-token',
					access_token: 'fake-access-token',
				},
			});

			sinon.stub(OAuth2Client.prototype, 'verifyIdToken').resolves({
				getPayload: () => ({
					email: 'fake@email.fr',
					email_verified: true,
					exp: Date.now() / 1000 - 60 * 60,
				}),
			});

			const response = await request(server)
				.get(endpoint)
				.query({ code: 'fake-code' });

			expect(response.status).toEqual(401);
			expect(response.body.message).toEqual('Google token is expired');
		});

		it('should return valid credential', async () => {
			sinon.stub(OAuth2Client.prototype, 'getToken').resolves({
				tokens: {
					id_token: 'fake-id-token',
					access_token: 'fake-access-token',
				},
			});

			sinon.stub(OAuth2Client.prototype, 'verifyIdToken').resolves({
				getPayload: () => ({
					email: 'fake@email.fr',
					email_verified: true,
					exp: Date.now() / 1000 + 60 * 60,
				}),
			});

			const response = await request(server)
				.get(endpoint)
				.query({ code: 'fake-code' });

			expect(response.status).toEqual(200);
			expect(response.body.email).toEqual('fake@email.fr');
			expect(response.body).toHaveProperty('token');
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
