import {Request} from './request.adapter';
import {Response} from './response.adapter';

export abstract class ServerAdapter {
  abstract use(middleware: Function): void;
  abstract listen(port: number, callback?: () => void): Promise<ServerAdapter>;
}
