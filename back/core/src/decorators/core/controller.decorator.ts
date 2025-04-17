import {
  CONTROLLER_METADATA,
  PATH_METADATA,
  PROVIDER_SCOPE_METADATA,
} from '../../constants';
import {Scope} from '../../enums';

export const Controller = (path = '/') => {
  return (target: Function) => {
    const opts = {type: 'controller', scope: Scope.SINGLETON};
    Reflect.defineMetadata(PROVIDER_SCOPE_METADATA, opts, target);
    Reflect.defineMetadata(PATH_METADATA, path, target);
    Reflect.defineMetadata(CONTROLLER_METADATA, true, target);
  };
};
