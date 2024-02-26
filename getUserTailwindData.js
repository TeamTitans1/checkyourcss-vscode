const vscode = require("vscode");
const traverse = require("@babel/traverse");
const { parse } = require("@babel/parser");

function getUserTailwindData(tailwindToCss) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("편집기가 활성화되어 있지 않습니다.");

    return;
  }

  const document = editor.document;
  const tailwindProperties = [];
  const cssProperties = [];
  const text = document.getText();
  const ast = parse(text, {
    sourceType: "unambiguous",
    plugins: ["jsx", "typescript"],
  });

  traverse.default(ast, {
    JSXAttribute({ node }) {
      if (node.name.name === "className") {
        if (node.value.type === "StringLiteral") {
          node.value.value
            .split(" ")
            .forEach(className => tailwindProperties.push(className));
        } else if (
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression.type === "StringLiteral"
        ) {
          node.value.expression.value
            .split(" ")
            .forEach(className => tailwindProperties.push(className));
        }
      }
    },
  });

  tailwindProperties.forEach(word => {
    tailwindToCss.forEach(element => {
      element.content.forEach(content => {
        content.table.forEach(list => {
          list.forEach(info => {
            if (info === word) {
              list.forEach(css => {
                if (css.includes(":")) {
                  if (css.split(":").length !== 2) {
                    const cssSplitArr = css.split("\n");

                    cssSplitArr.forEach(multi => {
                      cssProperties.push({
                        tw: word,
                        css: multi.split(":")[0],
                        declaratives: css,
                      });
                    });
                  } else {
                    cssProperties.push({
                      tw: word,
                      css: css.split(":")[0],
                      declaratives: css,
                    });
                  }
                }
              });
            }
          });
        });
      });
    });
  });

  return cssProperties;
}

module.exports = getUserTailwindData;
