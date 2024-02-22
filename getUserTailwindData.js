const vscode = require("vscode");

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
  const regex = /className=["|']([^"|']+)["|']/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    match[1].split(/\s+/).forEach(cssProperty => {
      tailwindProperties.push(cssProperty);
    });
  }

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
                      });
                    });
                  } else {
                    cssProperties.push({
                      tw: word,
                      css: css.split(":")[0],
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
