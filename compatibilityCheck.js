const bcd = require("@mdn/browser-compat-data");

async function checkCompatibility(userCss, cssData, userSelection) {
  const notSupported = [];

  for (const selection of userSelection) {
    const browser = selection.browser;
    const version = selection.version;

    for (const property of userCss) {
      let isCompatible = true;

      if (property.css in cssData.data.data) {
        const compatibility =
          cssData.data.data[property.css].stats[browser][version][0];

        isCompatible = compatibility === "y";
      } else if (property.css in bcd.css.properties) {
        const browserName = convertBrowserName(browser);
        const stat =
          bcd.css.properties[property.css].__compat.support[browserName];
        const versionAdded = Array.isArray(stat)
          ? stat[0].version_added
          : stat.version_added;

        if (typeof versionAdded === "string" && versionAdded.includes("-")) {
          const versionRangeToVersion =
            convertToNumberWithOneDecimal(versionAdded);

          isCompatible = parseInt(version, 10) >= versionRangeToVersion;
        } else {
          isCompatible = parseInt(version, 10) >= parseInt(versionAdded, 10);
        }
      }

      if (!isCompatible) {
        notSupported.push(property);
      }
    }
  }

  return notSupported;

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
}

module.exports = checkCompatibility;
