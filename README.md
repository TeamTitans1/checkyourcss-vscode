# Check Your CSS

"Check Your CSS" is a Visual Studio Code extension designed to check the compatibility of your CSS with the browsers and versions you select. It helps web developers identify and resolve CSS compatibility issues across different browsers quickly and efficiently.

## Features

- **Browser and Version Selection**: Allows you to select your preferred browsers and their versions. These settings are saved in `settings.json`.
- **Real-time Compatibility Checks**: Automatically checks your CSS for compatibility issues with the selected browsers and versions upon file save, highlighting any incompatible properties.
- **Hover Information**: Provides detailed information, suggested modifications, and MDN documentation links for incompatible CSS properties on hover.
- **Automatic CSS Correction**: The "Fix Your CSS" command applies necessary browser-specific prefixes to your CSS, ensuring compatibility with your selected browsers.

## Installation

Search for "Check Your CSS" in the Visual Studio Code Marketplace or directly install it using the command:

```bash
ext install check-your-css
```

## How to Use

1. **Set Browsers and Versions**:

- Open the Command Palette with Cmd+Shift+P or Ctrl+Shift+P.
- Search for "Check Your CSS: Set Browsers and Versions" and execute.
- Choose the browsers and their versions you're targeting.

2. **Compatibility Check**:

- After editing your code, save the file with Cmd+S or Ctrl+S.
- Any CSS properties incompatible with the selected settings will be underlined.

3. **Hover to Get Information**:

- Hovering over any highlighted CSS property will display a popup with compatibility information, suggestions for correction, and a link to MDN for more details.

4. **Automatically Correct CSS**:

- Open the Command Palette again.
- Search for "Fix Your CSS" and execute.
- The extension will automatically add necessary prefixes to your CSS.

## FAQ

**Q: Does it support all browsers and versions?**
A: "Check Your CSS" currently supports the latest versions of major browsers. The full list of supported browsers can be found in the extension's settings section.

**Q: How can I fix incompatible CSS properties?**
A: The "Fix Your CSS" command will automatically apply necessary prefixes for you. For manual corrections, hover over the property to see suggested modifications.

## Contributing

"Check Your CSS" is open to contributions! If you have suggestions for improvements or have found a bug, please visit our [GitHub repository](https://github.com/TeamTitans1/checkyourcss-vscode) to report an issue or submit a pull request.

## License

This extension is distributed under the MIT [License](LICENSE.txt). See the LICENSE file for more details.
