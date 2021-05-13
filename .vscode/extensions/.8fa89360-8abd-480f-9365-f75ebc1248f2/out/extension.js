"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fileRecord_1 = require("./fileRecord");
function activate(context) {
    const record = new fileRecord_1.default();
    vscode_1.workspace.onDidSaveTextDocument((document) => __awaiter(this, void 0, void 0, function* () {
        try {
            // If the document version has increased, the new version must be saved.
            const version = yield record.getLatestVersion(document.fileName);
            if (document.version > version) {
                yield record.saveNewVersion(document);
            }
        }
        catch (error) {
            console.error(error);
        }
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map