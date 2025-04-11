import { ValidatorType } from "../../enums/validator-type.enum";

export abstract class ServerAdapter {
  abstract use(middleware: Function): void;
  abstract useValidator(validator: ValidatorType): void;
  abstract listen(port: number, callback?: () => void): Promise<ServerAdapter>;
  // // Active a Dto validation with type of validator like Zod, Joi or class-validator
  // abstract useValidator(validator: Function): void;
  // // Active a Dto validation with type of validator like Zod, Joi or class-validator
  // abstract useValidatorAsync(validator: Function): Promise<void>;
  // abstract close(): Promise<void>;
  // abstract get port(): number;
}
