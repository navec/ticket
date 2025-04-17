import {ValidatorType} from '../../enums/validator-type.enum';

export abstract class ServerAdapter {
  abstract use(middleware: Function): void;
  abstract useValidator(validator: ValidatorType): void;
  abstract listen(port: number, callback?: () => void): Promise<ServerAdapter>;
  abstract serverInstance: unknown;
}
