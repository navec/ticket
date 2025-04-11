import {
  Request,
  Response,
  getMetadata,
  EndpointsRegistry,
  BODY_PARAM_METADATA,
  QUERY_PARAM_METADATA,
  PATH_PARAM_METADATA,
  REQ_PARAM_METADATA,
  RES_PARAM_METADATA,
  ParamType,
} from "..";
import { HttpException, InternalServerException } from "../exceptions";

export class RouterResolver {
  private metadataKeyByParamType = {
    [ParamType.body]: BODY_PARAM_METADATA,
    [ParamType.path]: PATH_PARAM_METADATA,
    [ParamType.query]: QUERY_PARAM_METADATA,
    [ParamType.req]: REQ_PARAM_METADATA,
    [ParamType.res]: RES_PARAM_METADATA,
  };

  private getAllRequestParams(
    controller: any,
    method?: string
  ): { type: ParamType; param: { index: number; key?: string } }[] {
    return Object.entries(this.metadataKeyByParamType).flatMap(
      ([type, key]) => {
        const params = getMetadata(key, controller, method) || [];
        return params.map((param: any) => ({ type, param }));
      }
    );
  }

  private async buildMethodArgs(
    req: Request,
    res: Response,
    params: { type: ParamType; param: { index: number; key?: string } }[]
  ) {
    const data = await req.body;
    return params.map(({ type, param: { key } }) => {
      switch (type) {
        case ParamType.body:
          return key ? data[key] : data;
        case ParamType.query:
          return key ? req.query[key] : req.query;
        case ParamType.path:
          return key ? req.path[key] : req.path;
        case ParamType.req:
          return req.req;
        case ParamType.res:
          return res;
        default:
          throw new Error(`Unsupported parameter type: ${type}`);
      }
    });
  }

  public async resolve(req: Request, res: Response) {
    try {
      const endpoint = EndpointsRegistry.get(req.pathname);
      if (!endpoint) {
        res.send({ message: `${req.pathname} not found`, code: 404 });
        return;
      }

      const { controller, method } = endpoint;
      // console.log(" ====>> controller <<=====", controller);
      const params = this.getAllRequestParams(controller, method.name);

      const args = await this.buildMethodArgs(req, res, params);
      const data = await method.bound(...args);
      res.send(data);
    } catch (error: any) {
      const isHttpException = error instanceof HttpException;
      res.send(isHttpException ? error : new InternalServerException(error));
    }
  }
}
