require("@babel/register")({
  configFile: require.resolve("../babel.config"),
  extensions: [".js", ".jsx", ".ts", ".tsx"],
});

require("ignore-styles");

require("@react-ssr/server/src");
