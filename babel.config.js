const resolvers = require("./lib/resolvers");

module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      "@babel/preset-env",
      "@babel/preset-typescript",
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
    ],
    plugins: [
      "./lib/babel-plugin-load.js",
      [
        "./lib/babel-plugin-file-loader.js",
        {
          isWebpack: false,
        },
      ],
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx"],
          alias: resolvers.client,
        },
      ],
    ],
  };
};
