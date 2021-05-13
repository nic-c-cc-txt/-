'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const snapshots = require("./snapshots");
const packageJson = require("../package.json");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const SnapshotContentProvider_1 = require("./lib/SnapshotContentProvider");
const SnapshotTreeDataProvider_1 = require("./lib/SnapshotTreeDataProvider");
const SnapshotContentProvider_2 = require("./lib/SnapshotContentProvider");
const fileExplorer_1 = require("./fileExplorer");
const extensionId = packageJson.name;
const extensionVersion = packageJson.version;
const key = process.env.AZURE_INSIGHTS_KEY;
// telemetry reporter
exports.reporter = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, key);
function activate(context) {
    let timeCapsuleProvider = new SnapshotTreeDataProvider_1.SnapshotTreeDataProvider(vscode.workspace.rootPath);
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('tcsnapshot', SnapshotContentProvider_2.SnapshotContentProvider));
    context.subscriptions.push(SnapshotContentProvider_1.snapshotOpenCommand);
    context.subscriptions.push(exports.reporter);
    vscode.window.registerTreeDataProvider('timeCapsule', timeCapsuleProvider);
    vscode.commands.registerCommand('timeCapsule.refreshEntry', () => timeCapsuleProvider.refresh());
    vscode.commands.registerCommand('timeCapsule.editEntry', (node) => timeCapsuleProvider.openDiff(node));
    new fileExplorer_1.FileExplorer(context);
}
exports.activate = activate;
function deactivate() {
    exports.reporter.dispose();
    snapshots.cleanup();
}
//# sourceMappingURL=extension.js.map