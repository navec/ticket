import {EndpointsRegistry} from '../registries';
import {
  BODY_PARAM_METADATA,
  getMetadata,
  ParamType,
  PATH_PARAM_METADATA,
  QUERY_PARAM_METADATA,
  REQ_PARAM_METADATA,
  Request,
  RES_PARAM_METADATA,
  Response,
  SCHEMA_PARAM_METADATA,
} from '..';

export class DtoExtractor {
  constructor(private readonly options: {target: any; method: string}) {}

  public extract() {
    const {target, method} = this.options;

    const dtoWithSchemaList =
      getMetadata(SCHEMA_PARAM_METADATA, target, method) || [];

    return dtoWithSchemaList.reduce(
      (
        acc: unknown[],
        current: {index: number; dtodWithSchema: {schema: unknown}},
      ) => {
        acc[current.index] = current.dtodWithSchema.schema;
        return acc;
      },
      [],
    );
  }
}
