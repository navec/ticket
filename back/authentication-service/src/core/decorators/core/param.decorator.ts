import {
  QUERY_PARAM_METADATA,
  BODY_PARAM_METADATA,
  PATH_PARAM_METADATA,
  REQ_PARAM_METADATA,
  RES_PARAM_METADATA,
} from '../../constants';
import {getMetadata} from '../utils';

const createParam =
  (type: string, key: string, name?: string) =>
  (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) {
      throw new Error(`property of ${type} is required`);
    }

    const current = getMetadata(key, target) || [];
    const value = [...current, {key: name, index: parameterIndex}];
    Reflect.defineMetadata(key, value, target);
  };

export const BodyParam = (name?: string): ParameterDecorator => {
  return createParam(BodyParam.name, BODY_PARAM_METADATA, name);
};

export const QueryParam = (name?: string): ParameterDecorator => {
  return createParam(QueryParam.name, QUERY_PARAM_METADATA, name);
};

export const PathParam = (name?: string): ParameterDecorator => {
  return createParam(PathParam.name, PATH_PARAM_METADATA, name);
};

export const ReqParam = (name?: string): ParameterDecorator => {
  return createParam(ReqParam.name, REQ_PARAM_METADATA, name);
};

export const ResParam = (name?: string): ParameterDecorator => {
  return createParam(ResParam.name, RES_PARAM_METADATA, name);
};
