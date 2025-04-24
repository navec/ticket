import { ValidatorType } from '../../enums/validator-type.enum';
import { UnknownFunction } from '../../types';

export abstract class ServerAdapter {
	abstract use(middleware: UnknownFunction): void;
	abstract useValidator(validator: ValidatorType): void;
	abstract listen(port: number, callback?: () => void): Promise<ServerAdapter>;
	abstract serverInstance: unknown;
}
