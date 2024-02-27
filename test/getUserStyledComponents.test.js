const assert = require("assert");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

describe("getStyledComponentsData Function", () => {
  it("should extract CSS properties from styled components", () => {
    const exampleCode = `
      const Example = styled.div\`
        width: 100%;
        height: 100%;
      \`;
    `;

    const ast = parse(exampleCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    let cssProperties = [];

    traverse(ast, {
      TaggedTemplateExpression(path) {
        const isStyledComponent =
          path.node.tag.type === "MemberExpression" &&
          path.node.tag.object.name === "styled";

        if (isStyledComponent) {
          path.node.quasi.quasis.forEach(element => {
            const cssText = element.value.raw;
            const regex = /(?<!-(webkit|moz|ms|o)-)\b(\w+-?\w+)\s*:/g;
            let match;

            while ((match = regex.exec(cssText))) {
              cssProperties.push({ css: match[2] });
            }
          });
        }
      },
    });

    assert.deepStrictEqual(cssProperties, [
      { css: "width" },
      { css: "height" },
    ]);
  });
});
