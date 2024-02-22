const vscode = require("vscode");
const { getCssData, getTailwindToCssData } = require("./getData");
const getStyledComponentsData = require("./getUserStyledComponents");
const setBrowserAndVersion = require("./setBrowserAndVersion");

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
    },
  );

  context.subscriptions.push(checkCompatibilityAndGetInfo);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
