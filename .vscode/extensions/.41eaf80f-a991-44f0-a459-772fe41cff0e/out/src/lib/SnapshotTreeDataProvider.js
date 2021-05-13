"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const snapshots = require("../snapshots");
const extension_1 = require("../extension");
class SnapshotTreeDataProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        snapshots.cleanup();
    }
    refresh() {
        extension_1.reporter.sendTelemetryEvent('command-refresh', { 'stringProp': 'some string' }, { 'numericMeasure': 123 });
        this._onDidChangeTreeData.fire();
        snapshots.cleanup();
    }
    openDiff(element) {
        vscode.commands.executeCommand(element.diffCommand.command, element.diffCommand.arguments[0], element.diffCommand.arguments[1]);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        if (!this.workspaceRoot || !vscode.window.activeTextEditor) {
            return Promise.resolve([]);
        }
        return snapshots.getTreeChildren();
    }
}
exports.SnapshotTreeDataProvider = SnapshotTreeDataProvider;
//# sourceMappingURL=SnapshotTreeDataProvider.js.map