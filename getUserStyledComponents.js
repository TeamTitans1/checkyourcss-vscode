const vscode = require("vscode");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function getStyledComponentsData() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("편집기가 활성화되어 있지 않습니다.");

    return;
  }

  const document = editor.document;
  const cssProperties = [];
  const fileContent = document.getText();

  const ast = parse(fileContent, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

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

  return cssProperties;
}

module.exports = getStyledComponentsData;
