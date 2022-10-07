import webpack from "webpack";

export const buildApp = function (config) {
  return new Promise((resolve) => {
    const compiler = webpack(config, (error, stats) => {
      if (error) {
        console.log(error.message);
        return;
      }

      if (stats.hasErrors()) {
        stats.toJson().errors.forEach((error) => {
          console.log(error);
        });
        return;
      }

      resolve(compiler);
    });
  });
};
