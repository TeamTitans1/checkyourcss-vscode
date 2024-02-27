const axios = require("axios");

async function getCssData() {
  const responseCss = await axios.get(
    "https://raw.githubusercontent.com/Fyrd/caniuse/main/fulldata-json/data-2.0.json",
  );

  return responseCss;
}

async function getTailwindToCssData() {
  const responseTailwind = await axios.get(
    "https://raw.githubusercontent.com/Devzstudio/tailwind_to_css/main/cheatsheet.ts",
  );
  const tailwindToCss = JSON.parse(
    responseTailwind.data.slice(
      responseTailwind.data.indexOf("["),
      responseTailwind.data.lastIndexOf("]") + 1,
    ),
  );

  return tailwindToCss;
}

module.exports = { getCssData, getTailwindToCssData };
