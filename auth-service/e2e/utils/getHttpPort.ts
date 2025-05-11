import { detectPort } from 'detect-port';

const MAX_HTTP_PORT = 65535;

const generateRandomHttpPort = (): number => {
	const port = Math.floor(Math.random() * 900000) + 10000;
	return port <= MAX_HTTP_PORT ? port : generateRandomHttpPort();
};

const isAvailablePort = async (port: number): Promise<boolean> => {
	return detectPort(port).then((item) => (item === port ? true : false));
};

export const getHttpPort = async (): Promise<number> => {
	const port = generateRandomHttpPort();
	const isAvailable = await isAvailablePort(port);

	return isAvailable ? port : getHttpPort();
};
