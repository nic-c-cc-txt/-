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
    constructor(label, version, tip, command) {
        super(label);
        this.label = label;
        this.version = version;
        this.tip = tip;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
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
//# sourceMappingURL=timeMachine.js.map