const genericNames = require("generic-names");
const path = require("path");

module.exports = function getModuleName(name, filepath) {
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
