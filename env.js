const path = require("path");
const crypto = require("crypto");
const genericNames = require("generic-names");

global.__resolve_root__ = function (...dist) {
  return path.resolve(".", ...dist);
};

global.__resolve_dist__ = function (...dist) {
  return path.resolve("./dist/", ...dist);
};

global.__resolve_client__ = function (...dist) {
  return path.resolve("./packages/client", ...dist);
};

global.__asset_name__ = function (filepath) {
  const { assetsPath, regExp } = __config__;

  if (regExp.font.test(filepath)) {
    return path.join(assetsPath.fonts, path.basename(filepath));
  }

  let md5 = crypto.createHash("md5");
  let hash = md5.update(filepath).digest("hex");
  let folder = "";

  if (regExp.image.test(filepath)) {
    folder = assetsPath.images;
  }

  return path.join(folder, `${hash}${path.extname(filepath)}`);
};

global.__css_module_name__ = function (name, filepath) {
  let parsed = path.parse(filepath);
  let filename;

  if (parsed.name.startsWith("index.")) {
    filename = path.basename(parsed.dir);
  } else if (parsed.name.includes(".module")) {
    filename = parsed.name.slice(0, parsed.name.indexOf(".module"));
  } else {
    filename = parsed.name;
  }

  return genericNames(
    process.env.NODE_ENV === "development"
      ? `${filename}__${name}_[hash:base64:5]`
      : "[hash:base64:5]"
  )(name, filepath);
};

global.__config__ = {
  assetsPath: {
    fonts: "assets/fonts",
    images: "assets/images",
  },
  chunksPath: {
    js: "chunks/js",
    css: "chunks/css",
  },
  resolvers: {
    client: {
      "@shared": __resolve_client__("src/components/shared"),
      "@components": __resolve_client__("src/components"),
      "@styles": __resolve_client__("styles"),
      "@screens": __resolve_client__("src/components/screens"),
      "@hooks": __resolve_client__("src/hooks"),
      "@dictionaries": __resolve_client__("src/dictionaries"),
      "@styles": __resolve_client__("styles"),
    },
  },
  regExp: {
    font: /\.(woff2?|ttf|otf)$/,
    image: /\.(png|jpe?g|gif|webp|avif)$/,
  },
};
