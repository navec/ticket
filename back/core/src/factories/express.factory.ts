import http from 'node:http';

export class ExpressAppFactory {
  private static instance: ExpressAppFactory | null = null;
  server: http.Server;

  private constructor(server: http.Server) {
    this.server = server;
  }

  public static create(): ExpressAppFactory {
    if (!this.instance) {
      const f = http.createServer();
      this.instance = new ExpressAppFactory(http.createServer());
    }
    return this.instance;
  }

  get<R>(path: string, callback: () => Promise<R> | R) {
    this.server.on('request', async ({method, url}, res) => {
      if (method !== 'GET' || url !== path) {
        throw new Error('Bad Request');
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      const result = await callback();
      res.end(JSON.stringify(result));
    });
  }

  listen(port: number, hostname: string = 'localhost'): ExpressAppFactory {
    this.server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });

    return this;
  }
}
