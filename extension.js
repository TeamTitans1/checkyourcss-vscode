const vscode = require("vscode");
const checkCompatibility = require("./compatibilityCheck");
const getUserTailwindData = require("./getUserTailwindData");
const setBrowserAndVersion = require("./setBrowserAndVersion");
const getStyledComponentsData = require("./getUserStyledComponents");
const { markLine } = require("./lineMarkAndHover");
const { getCssData, getTailwindToCssData } = require("./getData");
const extractWordAtPositionIncludingHyphen = require("./getWordIncludingHyphen");
const bcd = require("@mdn/browser-compat-data");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const cssData = await getCssData();
  const tailwindToCss = await getTailwindToCssData();
  let userCssData;

  const checkCompatibilityAndGetInfo = vscode.commands.registerCommand(
    "cyc.checkyourcss",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(
          "편집기가 활성화되어 있지 않습니다.",
        );

        return;
      }

      const document = editor.document;
      const documentText = document.getText();
      const agentData = cssData.data.agents;

      if (
        documentText.includes(`from "styled-components`) ||
        documentText.includes("from 'styled-components'")
      ) {
        userCssData = getStyledComponentsData();
      } else {
        userCssData = getUserTailwindData(tailwindToCss);
      }

      const userSelection = await setBrowserAndVersion(agentData);

      const notSupportedCss = await checkCompatibility(
        userCssData,
        cssData,
        userSelection,
      );

      markLine(notSupportedCss, userSelection);

      let lastHoverPosition = null;

      function provideHover(document, position) {
        const currentHoverPosition = `${position.line}:${position.character}`;

        if (lastHoverPosition === currentHoverPosition) {
          return;
        }

        lastHoverPosition = currentHoverPosition;

        const word = extractWordAtPositionIncludingHyphen(document, position);

        if (!word) {
          return;
        }

        const cssProperty = notSupportedCss.find(
          cssInfo => cssInfo.css === word || cssInfo.tw === word,
        );

        const browsersAndSupportedVersion = [];

        userSelection.forEach(selection => {
          const browserName = convertBrowserName(selection.browser);

          if (cssProperty.css in cssData.data.data) {
            const browserCompatibilityByVersions =
              cssData.data.data[cssProperty.css].stats[browserName];

            for (const version in browserCompatibilityByVersions) {
              const compatibility = browserCompatibilityByVersions[version];

              if (compatibility[0] === "y") {
                browsersAndSupportedVersion.push({
                  browser: selection.browserName,
                  version: version,
                });
                break;
              }
            }
          } else if (cssProperty.css in bcd.css.properties) {
            const stat =
              bcd.css.properties[cssProperty.css].__compat.support[browserName];

            if (
              typeof selection.version === "string" &&
              selection.version.includes("-")
            ) {
              versionRangeToVersion = convertToNumberWithOneDecimal(
                selection.version,
              );
            }

            const propertyAddedVersion = Array.isArray(stat)
              ? parseInt(stat[0].version_added)
              : parseInt(stat.version_added);

            browsersAndSupportedVersion.push({
              browser: selection.browserName,
              version: propertyAddedVersion,
            });
          }
        });

        function convertToNumberWithOneDecimal(numberRangeStr) {
          const parts = numberRangeStr.split("-");
          const numbers = parts.map(part => {
            const match = part.match(/^\d+\.\d?/);

            return match ? parseFloat(match[0]) : NaN;
          });
          const average = (numbers[0] + numbers[1]) / 2;

          return Math.round(average * 10) / 10;
        }

        function convertBrowserName(browserStat) {
          switch (browserStat) {
            case "samsung":
              return "samsunginternet_android";
            case "and_chr":
              return "chrome_android";
            case "android":
              return "webview_android";
            case "ios_saf":
              return "safari_ios";
            case "and_ff":
              return "firefox_android";
            default:
              return browserStat;
          }
        }

        if (cssProperty.css) {
          const compatibilityInfo = new vscode.MarkdownString();

          compatibilityInfo.appendMarkdown(`### ${cssProperty.css}\n\n`);
          browsersAndSupportedVersion.forEach(browserAndversion => {
            compatibilityInfo.appendMarkdown(
              `- **${browserAndversion.browser}**: Version **${browserAndversion.version}** supported and higher.\n\n`,
            );
          });
          compatibilityInfo.appendMarkdown(
            `[Find information on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/${cssProperty.css})`,
          );

          return new vscode.Hover(compatibilityInfo);
        }
      }

      const languages = ["javascript", "javascriptreact", "html"];

      languages.forEach(language => {
        const hoverProvider = vscode.languages.registerHoverProvider(
          { language, scheme: "file" },
          { provideHover },
        );

        context.subscriptions.push(hoverProvider);
      });
    },
  );

  context.subscriptions.push(checkCompatibilityAndGetInfo);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
