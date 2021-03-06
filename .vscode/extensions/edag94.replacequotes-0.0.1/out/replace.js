"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
exports.default = (textEditor, ToSingle) => {
    let replacee, replacer;
    //which replace logic
    if (ToSingle) {
        replacee = '\"';
        replacer = '\'';
    }
    else {
        replacee = '\'';
        replacer = '\"';
    }
    const text = textEditor.document.getText();
    //perform replace
    const replacedText = replaceString(text, replacee, replacer);
    //get the whole range...
    const firstLineIdx = 0;
    const firstLineRef = textEditor.document.lineAt(firstLineIdx);
    const firstChar = firstLineRef.range.start.character;
    const lastLineIdx = textEditor.document.lineCount - 1;
    const lastLineRef = textEditor.document.lineAt(lastLineIdx);
    const lastChar = lastLineRef.range.end.character;
    const textRange = new vscode.Range(0, firstChar, textEditor.document.lineCount - 1, lastChar);
    //swap og with replaced
    textEditor.edit(editBuilder => {
        editBuilder.replace(textRange, replacedText);
    });
};
function replaceString(str, replacee, replacement) {
    const regexFlags = 'g';
    const regex = new RegExp(replacee, regexFlags);
    const replaced = str.replace(regex, replacement);
    return replaced;
}
exports.replaceString = replaceString;
//# sourceMappingURL=replace.js.map