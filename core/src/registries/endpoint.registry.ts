import { HttpMethod } from '@core/enums';
import { InternalServerException } from '@core/exceptions';
import { UnknownFunction } from '@core/types';

export type ScoreValue = {
	method: { bound: UnknownFunction; name: string };
	controller: Record<string | symbol, UnknownFunction>;
	type: HttpMethod;
	path: string;
};

export class EndpointsRegistry {
	private static store = new Map<string, ScoreValue>();
	private static storeForVariblesPath = new Map<string, ScoreValue>();

	public static register(
		path: string,
		target: {
			method: { bound: UnknownFunction; name: string };
			type: HttpMethod;
			controller: Record<string | symbol, UnknownFunction>;
		}
	) {
		const httpMethod = HttpMethod[target.type!].toLocaleLowerCase();
		const splitPath = path.split('/');

		const isVariablePath = splitPath.some((segment) => segment.startsWith(':'));
		if (isVariablePath) {
			const variablePathRegex = `${httpMethod}${splitPath
				.map((segment) => (segment.startsWith(':') ? '([^/]+)' : segment))
				.join('/')}`;
			if (this.storeForVariblesPath.has(variablePathRegex)) {
				throw new InternalServerException(
					`Variable path ${variablePathRegex} already exists in the registry.`
				);
			}
			this.storeForVariblesPath.set(variablePathRegex, { ...target, path });
		} else {
			if (this.store.has(path)) {
				throw new InternalServerException(
					`Path ${path} already exists in the registry.`
				);
			}
			this.store.set(`${httpMethod}${path}`, { ...target, path });
		}
	}

	public static get(path: string, method: HttpMethod) {
		const formattedPath = `${HttpMethod[method].toLocaleLowerCase()}${path.endsWith('/') ? path.slice(0, -1) : path}`;
		if (this.store.has(formattedPath)) {
			return this.store.get(formattedPath);
		}

		const key = Array.from(this.storeForVariblesPath.keys()).find(
			(pattern: string) => {
				const regex = new RegExp(pattern);
				return regex.test(formattedPath);
			}
		);

		return key ? this.storeForVariblesPath.get(key) : null;
	}
}
