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
} from "..";

export class RouterResolver {
  private getParams(controller: any) {
    return [
      { type: "body", key: BODY_PARAM_METADATA },
      { type: "path", key: PATH_PARAM_METADATA },
      { type: "query", key: QUERY_PARAM_METADATA },
      { type: "req", key: REQ_PARAM_METADATA },
      { type: "res", key: RES_PARAM_METADATA },
    ].flatMap(({ type, key }) => {
      const params = getMetadata(key, controller) || [];
      return params.map((param: any) => ({ type, param }));
    });
  }

  public async resolve(req: Request, res: Response) {
    try {
      const { controller, method } = EndpointsRegistry.get(req.pathname);
      const params = this.getParams(controller);

      const args: any[] = [];
      await Promise.all(
        params.map(
          async ({
            type,
            param: { index, key },
          }: {
            type: "body" | "query" | "path" | "req" | "res";
            param: { index: number; key?: string };
          }) => {
            switch (type) {
              case "body":
                const body = await req.body;
                args[index] = key ? body[key] : body;
                break;
              case "query":
                args[index] = key ? req.query[key] : req.query;
                break;
              case "path":
                args[index] = key ? req.params[key] : req.params;
                break;
              case "req":
                args[index] = req;
                break;
              case "res":
                args[index] = res;
                break;
              default:
                throw new Error("Add functionnal error");
                break;
            }
          }
        )
      );

      const data = await method(...args);
      res.send(data);
    } catch (error) {
      res.send(error, { statusCode: 500 });
    }
  }
}
