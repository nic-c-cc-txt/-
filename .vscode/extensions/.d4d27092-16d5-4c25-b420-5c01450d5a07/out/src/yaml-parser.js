"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const E = require("fp-ts/lib/Either");
const constants_1 = require("./constants");
const util_1 = require("./util");
function parseYaml({ document, selection, }) {
    const selectedLine = document.lineAt(selection.active);
    if (selectedLine.isEmptyOrWhitespace) {
        return E.left(constants_1.Error.BlankLine);
    }
    if (util_1.isCommentLine(selectedLine.text)) {
        return E.left(constants_1.Error.CommentLine);
    }
    const range = new vscode.Range(0, 0, selection.end.line, selectedLine.text.length);
    const lines = document.getText(range).split('\n');
    // Remove the first line of `---`
    lines.shift();
    const expectedIndentationLine = util_1.isKey(selectedLine.text)
        ? selectedLine.text
        : util_1.findLineOfClosestKey(selectedLine.text, lines);
    const expectedLineSpace = util_1.textIndentations(expectedIndentationLine);
    return E.right(lines.filter(util_1.isUnnecessaryLine).reduce((result, line) => {
        const spaces = util_1.textIndentations(line);
        if (expectedLineSpace.length >= spaces.length) {
            result[spaces] = line.replace(constants_1.FIND_KEY_REGEX, '$1').trim();
        }
        return result;
    }, {}));
}
exports.parseYaml = parseYaml;
//# sourceMappingURL=yaml-parser.js.map