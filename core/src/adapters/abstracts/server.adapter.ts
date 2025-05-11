import { ValidatorType } from '@core/enums';
import { UnknownFunction } from '@core/types';

export abstract class ServerAdapter {
	abstract use(middleware: UnknownFunction): void;
	abstract useValidator(validator: ValidatorType): void;
	abstract listen(port: number, callback?: () => void): Promise<ServerAdapter>;
	abstract close(): Promise<void>;
	abstract serverInstance: unknown;
}
