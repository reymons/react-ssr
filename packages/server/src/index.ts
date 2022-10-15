import express from "express";
import path from "path";
import compression from "compression";
import WebSocket from "websocket";
import http from "http";
import { buildApp, config } from "@react-ssr/build";
import { getHtml } from "./helpers/get-html";

async function runServer() {
  const app = express();
  const server = http.createServer(app);
  const port = 7000;
  const isDev = process.env.NODE_ENV === "development";

  const compiler = await buildApp(config);

  const wss = new WebSocket.server({
    httpServer: server,
    autoAcceptConnections: false,
  });

  let connections: WebSocket.connection[] = [];

  const removeConnection = (connection: WebSocket.connection) => {
    connections = connections.filter(
      (_connection) => _connection !== connection
    );
  };

  wss.on("request", (req) => {
    const connection = req.accept("", req.origin);
    connections.push(connection);
    connection.on("close", () => removeConnection(connection));
    console.log("Connected " + connection.remoteAddress);
  });

  const notifyConnections = (msg: any) => {
    connections.forEach((connection) => {
      connection.send(msg);
    });
  };

  if (isDev) {
    let prevHash = "";

    compiler.watch({}, (_, result) => {
      if (result?.hash && prevHash !== result.hash) {
        notifyConnections(JSON.stringify({ type: "hmr" }));
        prevHash = result.hash;
      }
    });
  } else {
    app.use(compression());
  }

  app.use(express.static(path.resolve(__dirname, "../../../dist")));

  app.get("*", async (req, res) => {
    const html = await getHtml(req);
    res.send(html);
  });

  if (!process.env.PRE_COMMIT) {
    server.listen(port, () => {
      console.log("The server is running on port " + port);
    });
  }
}

runServer();
