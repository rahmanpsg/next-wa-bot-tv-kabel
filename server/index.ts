import next, { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import http from "http";
import { init } from "./whatsapp";

require("dotenv").config();

const dev: boolean = process.env.NODE_ENV !== "production";
const port: number = parseInt(process.env.PORT || "3000", 10);
const hostname: string = "localhost";

const appNext = next({ dev, hostname, port });
const handle: NextApiHandler = appNext.getRequestHandler();

const database = require("./config/database");
require("./config/cloudinary");

appNext
  .prepare()
  .then(() => {
    const app = require("./app").app;
    const io = require("./app").io;
    const server = http.createServer(app);

    io.attach(server);

    // init Whatsapp Bot
    init();

    // Fallback handler
    app.get("*", (req: NextApiRequest, res: NextApiResponse) => {
      return handle(req, res);
    });

    // Connect to mongodb
    database.connect();

    // Listen on the default port (3000)
    server.listen(port, hostname);
    console.log(`Server berjalan di http://${hostname}:${port}`);
  })
  .catch((error: any) => {
    console.error(error.stack);
    process.exit(1);
  });
