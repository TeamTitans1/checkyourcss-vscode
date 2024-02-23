const vscode = require("vscode");
const checkCompatibility = require("./compatibilityCheck");
const getUserTailwindData = require("./getUserTailwindData");
const setBrowserAndVersion = require("./setBrowserAndVersion");
const getStyledComponentsData = require("./getUserStyledComponents");
const { markLine } = require("./lineMarkAndHover");
const { getCssData, getTailwindToCssData } = require("./getData");

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

      markLine(notSupportedCss);
    },
  );

  context.subscriptions.push(checkCompatibilityAndGetInfo);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
