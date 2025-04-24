export abstract class ValidatorAdapter {
	abstract validate(schema: unknown[], data: unknown[]): Promise<void> | void;
}
