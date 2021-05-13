"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const E = require("fp-ts/lib/Either");
const yaml_parser_1 = require("./yaml-parser");
const constants_1 = require("./constants");
function getParsedFullKey(editor) {
    const document = editor.document;
    switch (document.languageId) {
        case 'yaml': {
            const parsedE = yaml_parser_1.parseYaml(editor);
            return E.map(parsed => Object.keys(parsed).reduce((result, key) => {
                result += !result ? parsed[key] : '.' + parsed[key];
                return result;
            }, ''))(parsedE);
        }
        default:
            return E.left(constants_1.Error.InvalidExtension);
    }
}
function activate(context) {
    console.log('yaml-key-viewer is active!');
    const parseYamlCommand = vscode.commands.registerCommand('cybai.parseYaml', function () {
        const result = getParsedFullKey(vscode.window.activeTextEditor);
        E.bimap(err => {
            switch (err) {
                case constants_1.Error.InvalidExtension:
                    vscode.window.showInformationMessage('Please use this extension with yaml files.');
            }
        }, res => vscode.window.showInformationMessage(res))(result);
    });
    const copyToClipboardCommand = vscode.commands.registerCommand('cybai.parseYaml.copyToClipboard', function () {
        const result = getParsedFullKey(vscode.window.activeTextEditor);
        E.bimap(err => {
            switch (err) {
                case constants_1.Error.InvalidExtension:
                    vscode.window.showInformationMessage('Please use this extension with yaml files.');
            }
        }, res => {
            vscode.env.clipboard.writeText(res);
            vscode.window.showInformationMessage(`${result} has been copied to clipboard.`);
        })(result);
    });
    context.subscriptions.push(parseYamlCommand);
    context.subscriptions.push(copyToClipboardCommand);
}
exports.activate = activate;
function deactivate() {
    console.log('yaml-key-viewer deactivated.');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map