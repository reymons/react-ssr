module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.callee.name !== "_jsx") return;

        const [tagName, propsObj] = path.node.arguments;

        if (tagName.value !== "img") return;

        for (let i = 0; i < propsObj.properties.length; i++) {
          const prop = propsObj.properties[i];
          const [key, value] = [prop.key.name, prop.value.value];

          if (key === "src" && typeof value === "string" && value) {
            prop.value = t.callExpression(t.identifier("require"), [
              t.stringLiteral(value),
            ]);
          }
        }
      },
    },
  };
};
