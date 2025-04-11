import { NotImplementedException } from "../../exceptions";
import { HttpServerRequestAdapter } from "../servers/http-server/request.adapter";
import { HttpServerResponseAdapter } from "../servers/http-server/response.adapter";

export abstract class MiddlewareAdapter {
  abstract use(
    req: HttpServerRequestAdapter,
    res: HttpServerResponseAdapter
  ): void;
}
