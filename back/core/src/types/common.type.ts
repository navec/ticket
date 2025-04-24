export type Constructor<T = unknown> = new (...args: unknown[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownFunction<T = any> = (...args: unknown[]) => T;
