const dict = require("./dict");
const crypto = require("crypto");
const path = require("path");

module.exports = function getAssetName(filepath) {
  if (dict.fontRegExp.test(filepath)) {
    return `fonts/${path.basename(filepath)}`;
  }

  let md5 = crypto.createHash("md5");
  let hash = md5.update(filepath).digest("hex");
  let folder = "";

  if (dict.imgRegExp.test(filepath)) {
    folder = "images/";
  }

  return `${folder}${hash}${path.extname(filepath)}`;
};
