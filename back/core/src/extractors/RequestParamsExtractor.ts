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
} from '..';

export class RequestParamsExtractor {
  private metadataKeyByParamType = {
    [ParamType.body]: BODY_PARAM_METADATA,
    [ParamType.path]: PATH_PARAM_METADATA,
    [ParamType.query]: QUERY_PARAM_METADATA,
    [ParamType.req]: REQ_PARAM_METADATA,
    [ParamType.res]: RES_PARAM_METADATA,
  };

  constructor(
    private readonly options: {
      request: Request;
      response: Response;
      target: Record<string | symbol, Function>;
      method: string;
    },
  ) {}

  private getAllRequestParams(): {
    type: ParamType;
    param: {index: number; key?: string};
  }[] {
    const {target, method} = this.options;

    return Object.entries(this.metadataKeyByParamType).flatMap(
      ([type, key]) => {
        const params = getMetadata(key, target, method) || [];
        return params.map((param: unknown) => ({type, param}));
      },
    );
  }

  public async extract() {
    const {request, response} = this.options;
    const body = await request.body;

    const params = this.getAllRequestParams();

    return params.map(({type, param: {key}}) => {
      switch (type) {
        case ParamType.body:
          return key ? body[key] : body;
        case ParamType.query:
          return key ? request.query[key] : request.query;
        case ParamType.path:
          return key ? request.path[key] : request.path;
        case ParamType.req:
          return {
            query: request.query,
            path: request.path,
            headers: request.headers,
            body,
          };
        case ParamType.res:
          return response;
        default:
          throw new Error(`Unsupported parameter type: ${type}`);
      }
    });
  }
}
