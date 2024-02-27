const vscode = require("vscode");

function getSettingJsonData() {
  const config = vscode.workspace.getConfiguration();
  const browserSettings = config.get("checkYourCSS.browsersAndVersions", []);

  return browserSettings;
}

module.exports = getSettingJsonData;
