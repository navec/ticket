import { Constructor } from '@core/types';

export class ProvidersRegistry {
	private static store = new Map<
		string,
		{ constructor: Constructor; instance: unknown | null }
	>();

	public static register({
		name,
		provider,
		instance,
	}: {
		name: string;
		provider: Constructor;
		instance?: unknown | null;
	}) {
		this.store.set(name, { constructor: provider, instance: instance ?? null });
	}

	public static get(name: string) {
		return this.store.get(name);
	}

	public static keys() {
		return Array.from(this.store.keys());
	}
}
