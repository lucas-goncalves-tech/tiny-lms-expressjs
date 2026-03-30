import { App } from "./app.ts";
import { envCheck } from "./shared/helper/env-check.helper.ts";

class Server {
  private readonly PORT = envCheck().PORT;
  private readonly express = new App();
  private server: ReturnType<typeof this.express.app.listen> | null = null;
  constructor() {
    this.init();
  }

  public readonly shutdown = (signal: "SIGINT" | "SIGTERM") => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    this.server?.close(() => {
      this.express.db.close();
      process.exit(0);
    });
    this.server?.closeAllConnections();
    setTimeout(() => {
      process.exit(1);
    }, 5_000).unref();
  };

  private init() {
    this.server = this.express.app.listen(this.PORT, () => {
      console.log(`Server is running on http://localhost:${this.PORT}`);
    });
  }
}

const server = new Server();
process.once("SIGINT", server.shutdown);
process.once("SIGTERM", server.shutdown);
