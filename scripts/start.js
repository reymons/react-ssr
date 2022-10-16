require("../env");

require("@babel/register")({
  configFile: require.resolve("../babel.config"),
  extensions: [".js", ".jsx", ".ts", ".tsx"],
});

require("css-modules-require-hook")({
  generateScopedName: __css_module_name__,
  extensions: [".scss"],
});

require("@react-ssr/server/src");
