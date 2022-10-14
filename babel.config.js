function clientPath(dist) {
  return `./packages/client/${dist}`;
}

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
        "module-resolver",
        {
          alias: {
            "@shared": clientPath("src/components/shared"),
            "@components": clientPath("src/components"),
            "@styles": clientPath("styles"),
            "@screens": clientPath("src/components/screens"),
            "@hooks": clientPath("src/hooks"),
          },
        },
      ],
    ],
  };
};
