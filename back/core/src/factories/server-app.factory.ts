import {ExpressAppFactory} from './express.factory';
import {ServerType} from './factory-types.enum';
import {HttpServerAppFactory} from './http-server.factory';

export class ServerAppFactory {
  static create<
    T extends HttpServerAppFactory | ExpressAppFactory = HttpServerAppFactory,
  >(presentations: {new (...args: any[]): {}}[], serverType?: ServerType) {
    if (!serverType) {
      return HttpServerAppFactory.create(presentations) as T;
    }

    switch (serverType) {
      case ServerType.EXPRESS:
        return ExpressAppFactory.create() as T;
      default:
        throw new Error("Server doesn't exit.");
    }
  }
}
