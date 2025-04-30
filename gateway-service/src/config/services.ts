import { env } from 'node:process';

const protocol = env.TS_NODE_DEV ? 'http' : 'https';

export const services = {
	auth: {
		name: env.AUTH_NAME,
		url: `${protocol}://${env.AUTH_URL}:${env.AUTH_PORT}`,
	},
};
