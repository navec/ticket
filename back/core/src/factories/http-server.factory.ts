import http, { IncomingMessage, ServerResponse } from "node:http";
import { IAppServerFactory } from "./app-server";
import { HttpMethod, HttpStatusCode } from "../constants";
import { getInstanceFromStorageOrThrow } from "../utils/getInstanceFromStorageOrThrow.util";
import { ALL_ROUTES } from "../constants/routes.constant";

export class HttpServerAppFactory implements IAppServerFactory {
  private static instance: HttpServerAppFactory | null = null;
  public server: http.Server;
  public port: number | undefined;
  public routes: Record<
    string,
    Record<string, { statusCode: HttpStatusCode; handler: Function }>
  >;

  private constructor(
    server: http.Server,
    presentations: { new (...args: any[]): {} }[]
  ) {
    this.server = server;
    this.port = undefined;
    this.routes = {};
    presentations.forEach((i) => getInstanceFromStorageOrThrow<typeof i>(i));
    this.routing();
  }

  private routing() {
    ALL_ROUTES.forEach(({ method, path, handler }) => {
      switch (method) {
        case HttpMethod.GET:
          this.get(path, handler);
          break;
        case HttpMethod.POST:
          this.post(path, handler);
          break;
        case HttpMethod.PATCH:
          this.patch(path, handler);
          break;
        case HttpMethod.PUT:
          this.put(path, handler);
          break;
        case HttpMethod.DELETE:
          this.delete(path, handler);
          break;
        default:
          throw new Error();
      }
    });
  }

  public static create(
    presentations: { new (...args: any[]): {} }[]
  ): HttpServerAppFactory {
    if (!this.instance) {
      this.instance = new HttpServerAppFactory(
        http.createServer(),
        presentations
      );
    }
    return this.instance;
  }

  public get(path: string, callback: Function, statusCode = HttpStatusCode.OK) {
    const pathRoutes = this.routes[path] ?? {};
    this.routes[path] = {
      ...pathRoutes,
      [HttpMethod.GET]: { handler: callback, statusCode },
    };

    // use logger add class name
    console.log(`[DEBUG]  :: ${path} route - GET`);
  }

  public post(path: string, callback: Function, statusCode = 201) {
    const pathRoutes = this.routes[path] ?? {};
    this.routes[path] = {
      ...pathRoutes,
      [HttpMethod.POST]: { handler: callback, statusCode },
    };

    // use logger add class name
    console.log(`[DEBUG]  :: ${path} route - POST`);
  }

  public put(path: string, callback: Function, statusCode = 200) {
    const pathRoutes = this.routes[path] ?? {};
    this.routes[path] = {
      ...pathRoutes,
      [HttpMethod.PUT]: { handler: callback, statusCode },
    };

    // use logger add class name
    console.log(`[DEBUG]  :: ${path} route - PUT`);
  }

  public patch(path: string, callback: Function, statusCode = 200) {
    const pathRoutes = this.routes[path] ?? {};
    this.routes[path] = {
      ...pathRoutes,
      [HttpMethod.PATCH]: { handler: callback, statusCode },
    };

    // use logger add class name
    console.log(`[DEBUG]  :: ${path} route - PATCH`);
  }

  public delete(path: string, callback: Function, statusCode = 200) {
    const pathRoutes = this.routes[path] ?? {};
    this.routes[path] = {
      ...pathRoutes,
      [HttpMethod.DELETE]: { handler: callback, statusCode },
    };

    // use logger add class name
    console.log(`[DEBUG]  :: ${path} route - DELETE`);
  }

  private async request(): Promise<void> {
    this.server.on("request", (req: IncomingMessage, res: ServerResponse) => {
      try {
        if (!req.url) {
          throw new Error("Invalid URL");
        }

        const url = new URL(req.url!, `http://${req.headers.host}`);
        const route = Object.keys(this.routes).find((path) => {
          const routePattern = path?.replace(/:([a-zA-Z]+)/g, "(?<$1>[^/]+)");
          return url.pathname.match(new RegExp(`^${routePattern}$`));
        });
        if (!req.method || !route || !this.routes[route][req.method]) {
          res.statusCode = 404;
          throw new Error("Not found");
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        const queryParam = Object.fromEntries(url.searchParams.entries()) || {};
        const routePattern = route?.replace(/:([a-zA-Z]+)/g, "(?<$1>[^/]+)");
        const pathParam =
          url.pathname.match(new RegExp(`^${routePattern}$`))?.groups || {};

        const { statusCode, handler } = this.routes[route][req.method];
        req.on("end", async () => {
          res.statusCode = statusCode;
          try {
            const result = await handler({
              request: {
                bodyParam: body.length ? JSON.parse(body) : {},
                queryParam,
                pathParam,
              },
              response: res,
            });
            // Should impl interceptor to get true status code
            res.writeHead(res.statusCode, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify(result));

            // use logger
            console.log(
              `[DEBUG]  :: ${url.pathname} route - ${req.method}, Success ${statusCode} with code response.`
            );
          } catch (error: any) {
            const { code, message } = JSON.parse(error.message);
            console.error(error);
            res.statusCode = code;
            res.end(message);
          }
        });
      } catch (error) {
        console.error("Error occurred during request handling:", error);
        res.end(`${error}\n`);
      }
    });
  }

  public listen(port: number, hostname: string = "localhost"): this {
    const ERROR_PREFIX = `[${HttpServerAppFactory.name}.${this.listen.name}] :: `;
    try {
      this.server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
      });

      // Si le server demarre
      this.server.on("listening", () => {
        this.port = port;
        this.request();
      });

      // En cas erreur sur la connection
      this.server.on("error", (err: NodeJS.ErrnoException) => {
        console.error(`Error starting server: ${err.message}`);
        if (err.code === "EADDRINUSE") {
          throw new Error(`${ERROR_PREFIX} Port ${port} is already in use`);
        }
        throw new Error(`${ERROR_PREFIX} Server error -> ${err}`);
      });
    } catch (err) {
      // Erreur par defaut
      throw new Error(
        `${ERROR_PREFIX} Unexpected error during server startup -> ${err}`
      );
    }
    return this;
  }
}
