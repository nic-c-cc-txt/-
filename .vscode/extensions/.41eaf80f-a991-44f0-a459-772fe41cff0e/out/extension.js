'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("./util");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const SnapshotTreeDataProvider_1 = require("./lib/SnapshotTreeDataProvider");
const SnapshotContentProvider_1 = require("./lib/SnapshotContentProvider");
let extensionId = 'time-capsule';
let extensionVersion = '0.0.7';
let correlationId = Buffer.from("YTdlNGExYzctZDIyMy00MjZjLTk2ZGItZTY3MDRkMzdkMzhl", "base64").toString();
exports.reporter = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, correlationId);
function activate(context) {
    let timeCapsuleProvider = new SnapshotTreeDataProvider_1.SnapshotTreeDataProvider(vscode.workspace.rootPath);
    vscode.window.onDidChangeActiveTextEditor((editor) => __awaiter(this, void 0, void 0, function* () {
        if (!tv.visible || !editor || editor.document.uri.scheme !== 'file') {
            return;
        }
        console.info('[INFO] Switched editor, calling refresh...');
        timeCapsuleProvider.refresh();
    }), null, context.subscriptions);
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('timecapsule', SnapshotContentProvider_1.SnapshotContentProvider));
    context.subscriptions.push(exports.reporter);
    exports.reporter.sendTelemetryEvent("activate");
    let tv = vscode.window.createTreeView('timeCapsule', { treeDataProvider: timeCapsuleProvider });
    tv.onDidChangeVisibility((ev) => {
        if (!ev.visible || !vscode.window.activeTextEditor.document || vscode.window.activeTextEditor.document.uri.scheme !== 'file') {
            return;
        }
        console.info('[INFO] Visibility changed, calling refresh...');
        timeCapsuleProvider.refresh();
    });
    vscode.commands.registerCommand('timeCapsule.addEntry', () => timeCapsuleProvider.createSnapshot());
    vscode.commands.registerCommand('timeCapsule.diffEntry', (node) => timeCapsuleProvider.openDiff(node));
}
exports.activate = activate;
function deactivate() {
    exports.reporter.dispose();
    util_1.cleanup();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map