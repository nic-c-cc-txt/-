"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
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
//# sourceMappingURL=SnapshotTreeItem.js.map