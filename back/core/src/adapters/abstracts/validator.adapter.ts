export abstract class ValidatorAdapter {
  abstract validate(schema: any[], data: unknown[]): Promise<void> | void;
}
