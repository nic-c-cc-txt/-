"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const child_process_1 = require("child_process");
const snapshots = require("./lib/snapshots");
// TODO: on startup, unmount any snapshots in /tmp
class SnapshotNodeProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
        child_process_1.spawnSync('diskutil', ['unmount', '/tmp/ssvscode-*']);
        child_process_1.spawnSync('rmdir', ['/tmp/ssvscode-*']);
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
exports.SnapshotNodeProvider = SnapshotNodeProvider;
class SnapshotTreeItem extends vscode.TreeItem {
    constructor(label, version, tip, command, diffCommand) {
        super(label);
        this.label = label;
        this.version = version;
        this.tip = tip;
        this.command = command;
        this.diffCommand = diffCommand;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'code-commit.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'code-commit.svg')
        };
        this.contextValue = 'snapshot';
    }
    get tooltip() {
        return this.tip;
    }
    get description() {
        return this.version;
    }
}
exports.SnapshotTreeItem = SnapshotTreeItem;
//# sourceMappingURL=timeCapsule.js.map