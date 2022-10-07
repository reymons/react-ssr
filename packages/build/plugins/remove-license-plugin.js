export class RemoveLicensePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("RemoveLicensePlugin", (compilation) => {
      compilation.hooks.afterProcessAssets.tap("RemoveLicensePlugin", () => {
        Object.keys(compilation.assets).forEach((name) => {
          if (name.includes("LICENSE")) {
            delete compilation.assets[name];
          }
        });
      });
    });
  }
}
