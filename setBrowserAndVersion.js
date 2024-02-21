const vscode = require("vscode");

async function selectBrowsersAndVersions(agentsData) {
  const browsers = {
    Chrome: {
      version: agentsData.chrome.version_list,
      stat: "chrome",
    },
    FireFox: {
      version: agentsData.firefox.version_list,
      stat: "firefox",
    },
    Safari: {
      version: agentsData.safari.version_list,
      stat: "safari",
    },
    Edge: {
      version: agentsData.edge.version_list,
      stat: "edge",
    },
    Opera: {
      version: agentsData.opera.version_list,
      stat: "opera",
    },
    Samsung_Mobile: {
      version: agentsData.samsung.version_list,
      stat: "samsung",
    },
    Chrome_for_android: {
      version: agentsData.and_chr.version_list,
      stat: "and_chr",
    },

    Android: {
      version: agentsData.android.version_list,
      stat: "android",
    },

    Safari_on_iOS: {
      version: agentsData.ios_saf.version_list,
      stat: "ios_saf",
    },

    FireFox_for_android: {
      version: agentsData.and_ff.version_list,
      stat: "and_ff",
    },
  };
  try {
    const selectedBrowsers = await vscode.window.showQuickPick(
      Object.keys(browsers),
      { canPickMany: true, placeHolder: "Select browsers" },
    );

    if (!selectedBrowsers || selectedBrowsers.length === 0) return;

    const versions = {};

    Object.keys(browsers).forEach(browser => {
      const versionList = [];
      browsers[browser].version.forEach(versionInfos => {
        versionList.push(versionInfos.version);
      });
      versions[browser] = versionList;
    });

    const browserVersions = [];
    for (const browser of selectedBrowsers) {
      const version = await vscode.window.showQuickPick(versions[browser], {
        canPickMany: false,
        placeHolder: `Select a version for ${browser}`,
      });

      if (version) {
        browserVersions.push({
          browserName: browser,
          browser: browsers[browser].stat,
          version,
        });
      }
    }

    return browserVersions;
  } catch (error) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

module.exports = selectBrowsersAndVersions;
