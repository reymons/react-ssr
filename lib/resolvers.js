const path = require("path");

function resolveClient(...dist) {
  return path.resolve(__dirname, "../packages/client/", ...dist);
}

const client = {
  "@shared": resolveClient("src/components/shared"),
  "@components": resolveClient("src/components"),
  "@styles": resolveClient("styles"),
  "@screens": resolveClient("src/components/screens"),
  "@hooks": resolveClient("src/hooks"),
  "@dictionaries": resolveClient("src/dictionaries"),
  "@styles": resolveClient("styles"),
};

module.exports = {
  client,
  resolveClient,
};
