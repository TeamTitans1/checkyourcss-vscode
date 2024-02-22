const vscode = require("vscode");

async function markLine(notSupportedCss) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("편집기가 활성화되어 있지 않습니다.");

    return;
  }

  const document = editor.document;
  const text = document.getText();
  const diagnostics = [];

  function isDuplicateDiagnostic(newDiagnostic) {
    return diagnostics.some(
      (diagnostic) =>
        diagnostic.range.isEqual(newDiagnostic.range) &&
        diagnostic.message === newDiagnostic.message
    );
  }

  for (const property of notSupportedCss) {
    const regex = new RegExp(property.tw || property.css, "g");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(startPos, endPos);
      const diagnostic = new vscode.Diagnostic(
        range,
        "Check Your CSS",
        vscode.DiagnosticSeverity.Warning
      );

      if (!isDuplicateDiagnostic(diagnostic)) {
        diagnostics.push(diagnostic);
      }
    }
  }

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("cssCompatibility");

  diagnosticCollection.set(document.uri, diagnostics);
}

module.exports = { markLine };
