module.exports = function ({ types: t }, opts) {
  const { isWebpack } = opts;

  return {
    visitor: {
      JSXAttribute(path) {
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

        const filepath = __resolve_client__("public", value);
        path.node.value = t.stringLiteral(__get_asset_name__(filepath));
      },
    },
  };
};
