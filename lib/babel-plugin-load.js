module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== "@react-ssr/load") {
          return;
        }

        const specifier = path.get("specifiers")[0];

        if (
          specifier.node.local.name !== "load" ||
          t.isImportDefaultSpecifier(path.node) ||
          !specifier.scope.bindings.load
        ) {
          return;
        }

        specifier.scope.bindings.load.referencePaths.forEach((refPath) => {
          if (!refPath.parentPath.isCallExpression()) {
            return;
          }

          let callExpression = refPath.parentPath;
          let request = "";

          /** Get and traverse the arguments and retrieve the request */
          /** load(() => import(request)) */
          /**      ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ */
          callExpression.get("arguments")[0].traverse({
            Import(path) {
              request = path.parentPath.node.arguments[0].value;
            },
          });

          /** No options */
          if (!callExpression.node.arguments[1]) {
            callExpression.node.arguments.push(t.objectExpression([]));
          }

          /** Add moduleName to options */
          callExpression.node.arguments[1].properties.push(
            t.objectProperty(
              t.stringLiteral("request"),
              t.stringLiteral(request)
            )
          );
        });
      },
    },
  };
};
