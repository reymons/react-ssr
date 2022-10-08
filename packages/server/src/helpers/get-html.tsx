import { App } from "@react-ssr/client/src/App";
import { getChunkFilenames, LoadProvider } from "@react-ssr/load";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import { Request } from "express";

function mapChunks(data: string[], pattern: string) {
  return data.map((file) => pattern.replace("$file", file)).join("\n");
}

export function getHtml(req: Request) {
  return new Promise((resolve) => {
    const requests: string[] = [];

    const html = renderToString(
      <StaticRouter location={req.url}>
        <LoadProvider onRequest={(req) => requests.push(req)}>
          <App />
        </LoadProvider>
      </StaticRouter>
    );

    const manifest = require("../../../../dist/manifest.json");
    const { js, css } = getChunkFilenames(requests, manifest, true);

    resolve(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>React App</title>
          ${mapChunks(js, "<script src='$file' defer></script>")}
          ${mapChunks(css, "<link href='$file' rel='stylesheet' />")}
        </head>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);
  });
}
