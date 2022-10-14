import { Compilation, Compiler } from "webpack";
import { Manifest } from "./common";

const name = "ManifestPlugin";

type Options = {
  filename: string;
};

function getManifest(compilation: Compilation) {
  const manifest: Manifest = {};
  const entrypointFilenames: string[] = [];

  compilation.entrypoints.forEach((entrypoint) => {
    entrypoint.getFiles().forEach((file) => {
      if (!entrypointFilenames.includes(file)) {
        entrypointFilenames.push(file);
      }
    });
  });

  compilation.chunks.forEach((chunk) => {
    compilation.chunkGraph.getChunkModules(chunk).forEach((module: any) => {
      chunk.files.forEach((file) => {
        const isEntry = entrypointFilenames.includes(file);

        if (module.rawRequest || isEntry) {
          manifest[file] = {
            request: module.rawRequest || "",
            isEntry,
          };
        }
      });
    });
  });

  return manifest;
}

export class ManifestPlugin {
  filename: string;

  constructor(opts: Options) {
    if (typeof opts.filename !== "string") {
      throw new Error(
        "Expected the filename to be a string. Got " + opts.filename
      );
    }

    this.filename = opts.filename;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(name, (compilation) => {
      compilation.hooks.afterProcessAssets.tap(name, () => {
        const manifest = getManifest(compilation);
        const json = JSON.stringify(manifest, null, 2);

        // @ts-ignore
        compilation.assets[this.filename] = {
          source: () => json,
          size: () => json.length,
        };
      });
    });
  }
}
