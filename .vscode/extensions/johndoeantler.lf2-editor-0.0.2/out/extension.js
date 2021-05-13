"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const utils_1 = require("./utils/utils");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //
    // ─── ON ENCRYPT COMMAND EXECUTED ────────────────────────────────────────────────
    //
    context.subscriptions.push(vscode.commands.registerCommand('lf2-editor.encryptDocument', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const doc = editor.document;
            const arr = yield vscode.workspace.fs.readFile(doc.uri);
            yield editor.edit((eb) => {
                return eb.replace(utils_1.selectAll(doc), utils_1.encrypt(arr));
            });
            yield doc.save();
            vscode.window.showInformationMessage("Document encrypted.");
        }
        else {
            vscode.window.showErrorMessage("There is no document opened.");
        }
    })));
    //
    // ─── ON DECRYPT COMMAND EXECUTED ────────────────────────────────────────────────
    //
    context.subscriptions.push(vscode.commands.registerCommand('lf2-editor.decryptDocument', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const doc = editor.document;
            const arr = yield vscode.workspace.fs.readFile(doc.uri);
            yield editor.edit((eb) => {
                return eb.replace(utils_1.selectAll(doc), utils_1.decrypt(arr));
            });
            yield doc.save();
            vscode.window.showInformationMessage("Document decrypted.");
        }
        else {
            vscode.window.showErrorMessage("There is no document opened.");
        }
    })));
    //
    // ─── ON TOGGLE COMMAND EXECUTED ─────────────────────────────────────────────────
    //
    context.subscriptions.push(vscode.commands.registerCommand('lf2-editor.toggleDocument', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const doc = editor.document;
            const arr = yield vscode.workspace.fs.readFile(doc.uri);
            yield editor.edit((eb) => {
                return doc.lineCount > 1 ? eb.replace(utils_1.selectAll(doc), utils_1.encrypt(arr)) : eb.replace(utils_1.selectAll(doc), utils_1.decrypt(arr));
            });
            yield doc.save();
            vscode.window.showInformationMessage("Document decrypted.");
        }
        else {
            vscode.window.showErrorMessage("There is no document opened.");
        }
    })));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map