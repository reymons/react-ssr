import webpack, { Configuration } from "webpack";

export const buildApp = function (config: Configuration) {
  return new Promise((resolve) => {
    const compiler = webpack(config, (error, stats) => {
      if (error) {
        console.log(error.message);
        return;
      }

      if (!stats || stats.hasErrors()) {
        stats?.toJson().errors?.forEach((error) => {
          console.log(error);
        });
        return;
      }

      resolve(compiler);
    });
  });
};
