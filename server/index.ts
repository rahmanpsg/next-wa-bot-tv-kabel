import next from 'next';
import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

require("dotenv").config();

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3000', 10)
const hostname = "localhost";

const appNext = next({ dev, hostname, port })
const handle = appNext.getRequestHandler()

appNext.prepare().then(() => {
  const app = require("./app");
  const server = http.createServer(app);

  // Fallback handler
  app.get("*", (req: IncomingMessage, res: ServerResponse) => {
    return handle(req, res);
  });

  // Listen on the default port (3000)
  server.listen(port, hostname);
  console.log(`Server jalan di http://${hostname}:${port}`);

}).catch((error: any) => {
  console.error(error.stack);
  process.exit(1);
});
