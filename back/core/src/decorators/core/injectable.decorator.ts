import {INJECTABLE_METADATA, PROVIDER_SCOPE_METADATA} from '../../constants';
import {Scope} from '../../enums';

export const Injectable = () => {
  return (target: Function) => {
    const opts = {type: 'provider', scope: Scope.SINGLETON};
    Reflect.defineMetadata(PROVIDER_SCOPE_METADATA, opts, target);
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
};
