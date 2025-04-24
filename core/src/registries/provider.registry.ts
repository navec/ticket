import { Constructor } from '..';

export class ProvidersRegistry {
	private static store = new Map<Constructor, { instance: unknown | null }>();

	public static register(
		provider: Constructor,
		instance: unknown | null = null
	) {
		this.store.set(provider, { instance });
	}

	public static get(provider: Constructor) {
		return this.store.get(provider);
	}

	public static keys() {
		return Array.from(this.store.keys());
	}
}
