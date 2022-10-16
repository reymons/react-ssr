const getAssetName = require("./get-asset-name");
const resolvers = require("./resolvers");

module.exports = function ({ types: t }, opts) {
  const { isWebpack } = opts;

  return {
    visitor: {
      JSX(path) {
        if (!path.isJSXAttribute()) {
          return;
        }

        if (path.node.name.name !== "src") {
          return;
        }

        let value;
        let valueNode = path.node.value;

        if (t.isStringLiteral(valueNode)) {
          value = valueNode.value;
        } else if (t.isJSXExpressionContainer(valueNode)) {
          value = valueNode.expression.value;
        }

        if (!value) return;

        if (isWebpack) {
          path.node.value = t.jsxExpressionContainer(
            t.callExpression(t.identifier("require"), [t.stringLiteral(value)])
          );
          return;
        }

        const filepath = resolvers.resolveClient("public", value);
        path.node.value = t.stringLiteral(getAssetName(filepath));
      },
    },
  };
};
