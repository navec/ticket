import {Constructor} from './common.type';
import {Scope} from '../enums/scope.enum';

export type Provider = {
  type: 'controller' | 'injectable' | 'module';
  scope: Scope;
  useClass: Constructor;
  opts?: any;
};
