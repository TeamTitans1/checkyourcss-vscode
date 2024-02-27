function extractWordAtPositionIncludingHyphen(document, position) {
  const textLine = document.lineAt(position.line).text;
  const regex = /[\w-]+/g;
  let match;

  while ((match = regex.exec(textLine)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start <= position.character && position.character <= end) {
      return match[0];
    }
  }

  return null;
}

module.exports = extractWordAtPositionIncludingHyphen;
