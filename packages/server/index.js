require("@babel/register")({
  configFile: "../../babel.config.js",
  include: /node_modules/,
});

require("ignore-styles");

require("./app");
