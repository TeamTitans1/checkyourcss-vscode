const fs = require("fs");
const vscode = require("vscode");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const traverse = require("@babel/traverse").default;
const { parse } = require("@babel/parser");

function getCssText(fileContent) {
  const cssText = [];
  const ast = parse(fileContent, {
    sourceType: "unambiguous",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    TaggedTemplateExpression(path) {
      const isStyledComponent =
        path.node.tag.type === "MemberExpression" &&
        path.node.tag.object.name === "styled";

      if (isStyledComponent) {
        path.node.quasi.quasis.forEach(element => {
          cssText.push(element.value.raw);
        });
      }
    },
  });

  return cssText;
}

function extractCssProperties(cssText) {
  const properties = [];

  cssText.forEach(text => {
    const cssProperties = text.split("\n");

    cssProperties.forEach(property => {
      const pattern = /([\w-]+)\s*:\s*([\w-]+)/g;
      const matches = property.match(pattern);

      if (matches) {
        properties.push(matches[0] + ";");
      }
    });
  });

  return properties;
}

async function addPrefixes(css, browserQuery) {
  const autoprefixerPlugin = autoprefixer({
    overrideBrowserslist: [browserQuery],
  });
  const processedCss = await postcss(autoprefixerPlugin).process(css, {
    from: undefined,
  });

  return processedCss.css;
}

async function getCssPolyfills(userSelections, content) {
  const result = userSelections.map(async selection => {
    const browserQuery = `${selection.browser} ${selection.version}`;
    const finalCss = await addPrefixes(content, browserQuery);
    const splittedCss = finalCss.split(";");
    const temp = [];

    for (let i = 1; i < splittedCss.length; i++) {
      if (
        splittedCss[i].includes("-webkit-") ||
        splittedCss[i].includes("-moz-") ||
        splittedCss[i].includes("-ms-") ||
        splittedCss[i].includes("-o-")
      ) {
        continue;
      } else {
        if (
          splittedCss[i - 1].includes("-webkit") ||
          splittedCss[i - 1].includes("-moz") ||
          splittedCss[i - 1].includes("-ms") ||
          splittedCss[i - 1].includes("-o-")
        ) {
          let j = i - 1;
          const info = { [splittedCss[i]]: [] };

          while (
            (splittedCss[j].includes("-webkit") ||
              splittedCss[j].includes("-moz") ||
              splittedCss[j].includes("-ms") ||
              splittedCss[j].includes("-o")) &&
            j >= 0
          ) {
            info[splittedCss[i]].push(splittedCss[j]);
            j--;
          }

          temp.push(info);
        }
      }
    }

    return temp;
  });

  return await Promise.all(result);
}

function fixFileContent(results, fileContent) {
  results.flat().forEach(result => {
    const keys = Object.keys(result);

    keys.forEach(key => {
      if (result[key].length > 1) {
        const substitutionString = result[key]
          .map(value => value + ";")
          .join("\n");

        fileContent = fileContent.replace(
          new RegExp(key, "g"),
          match => `${substitutionString}\n  ${match}`,
        );
      } else {
        fileContent = fileContent.replace(
          new RegExp(key, "g"),
          match => `${result[key]};\n  ${match}`,
        );
      }
    });
  });

  return fileContent;
}

async function changeStyledComponentsCss(documentText, userSelections) {
  const cssText = getCssText(documentText);
  const content = [...new Set(extractCssProperties(cssText))].join("");
  const results = await getCssPolyfills(userSelections, content);
  const modifiedContent = fixFileContent(results, documentText);
  const filePath = vscode.window.activeTextEditor.document.uri.fsPath;

  fs.writeFileSync(filePath, modifiedContent);
}

module.exports = changeStyledComponentsCss;
