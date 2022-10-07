import express from "express";
import path from "path";
import compression from "compression";
import { buildApp, prodConfig } from "@react-ssr/build";
import { getHtml } from "./helpers/get-html";

async function runServer() {
  const app = express();
  const port = 7000;

  await buildApp(prodConfig);

  app.get("^(/|/cars)$", async (req, res) => {
    const html = await getHtml(req);
    res.send(html);
  });

  app.use(compression());

  app.use(express.static(path.resolve(__dirname, "../../dist")));

  app.listen(port, () => {
    console.log("The server is running on port " + port);
  });
}

runServer();
