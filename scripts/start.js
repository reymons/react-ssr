require("@babel/register")({
  configFile: require.resolve("../babel.config"),
  extensions: [".js", ".jsx", ".ts", ".tsx"],
});

require("css-modules-require-hook")({
  generateScopedName: require("../lib/get-module-names"),
  extensions: [".scss"],
});

require("@react-ssr/server/src");
