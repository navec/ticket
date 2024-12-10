import {HttpServerAdapter, ServerAdapter, ServerType} from '..';
import {AppBuilder} from './app.builder';

class AppFactory {
  getServer(type = ServerType.HTTP_SERVER): ServerAdapter {
    switch (type) {
      case ServerType.HTTP_SERVER:
        return new HttpServerAdapter();
      case ServerType.EXPRESS:
        throw new Error('Method not implemented');
      default:
        throw new Error(`Unsupported server type: ${type}`);
    }
  }

  async create(module: any, type?: ServerType) {
    return new AppBuilder()
      .setModule(module)
      .setServer(this.getServer(type))
      .build();
  }
}

export const AppBootFactory = new AppFactory();
