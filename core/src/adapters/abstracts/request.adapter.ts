export abstract class Request {
	abstract get pathname(): string;
	abstract get query(): Record<string, unknown>;
	abstract get path(): Record<string, unknown>;
	abstract get headers(): Record<string, string>;
	abstract get body():
		| Record<string, unknown>
		| Promise<Record<string, unknown>>;
	abstract get cookies(): Record<string, string>;
}
