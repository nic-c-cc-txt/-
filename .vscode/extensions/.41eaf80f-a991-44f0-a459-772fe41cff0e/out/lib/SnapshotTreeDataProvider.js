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
const vscode = require("vscode");
const child_process_1 = require("child_process");
const snapshots = require("../snapshots");
const util_1 = require("../util");
const SnapshotTreeItem_1 = require("./SnapshotTreeItem");
class SnapshotTreeDataProvider {
    //
    // Constructor
    //
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.onDidChangeTreeDataEvent = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.onDidChangeTreeDataEvent.event;
        //
        // Tree data structure
        //
        this.tree = {
        // '/Users/john/filename.txt': {
        // 	'1234567890': this.item
        // }
        };
        this.treeCache = {
        // this gets set when backups are cached with the timestamp
        // if the timestamp is less than 5 minutes old, use the saved data
        // '/Users/john/filename.txt': 12334508967
        };
        util_1.cleanup();
    }
    //
    // Load tree
    //
    refresh() {
        this.onDidChangeTreeDataEvent.fire();
    }
    //
    // SnapshotTreeItem
    //
    getTreeItem(element) {
        return element;
    }
    updateTreeFromSnaps(fileName, snaps) {
        if (!snaps)
            return;
        snapshotsToTreeItems(fileName, snaps).forEach(snap => {
            if (!snap)
                return;
            if (!this.tree[fileName])
                this.tree[fileName] = {};
            this.tree[fileName][snap.mtimeMs] = snap;
            this.treeCache[fileName] = +new Date();
        });
        this.refresh();
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.workspaceRoot || !vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document) {
                return Promise.resolve([]);
            }
            let fileName = vscode.window.activeTextEditor.document.fileName;
            // 5 minutes
            let cacheDuration = 60000 * 5;
            let treeAge = +new Date() - this.treeCache[fileName];
            console.log(fileName);
            // There are no tree entries for this fileName, so lazy load them
            if (!fileName.startsWith('/local') && !fileName.startsWith('/backupdb') &&
                (!this.tree[fileName] || (treeAge > cacheDuration))) {
                snapshots.localSnapshotsForFile(fileName).then(localSnaps => {
                    this.updateTreeFromSnaps(fileName, localSnaps);
                });
                snapshots.dbSnapshotsForFile(fileName).then(dbSnaps => {
                    this.updateTreeFromSnaps(fileName, dbSnaps);
                });
            }
            return Promise.resolve(this.sortedTreeEntries(fileName));
        });
    }
    sortedTreeEntries(fileName) {
        if (!this.tree[fileName])
            return [];
        return Object.values(this.tree[fileName]).sort((a, b) => {
            return a['mtimeMs'] < b['mtimeMs'] ? 1 : -1;
        });
    }
    //
    // Actions
    //
    createSnapshot() {
        return __awaiter(this, void 0, void 0, function* () {
            console.info('[INFO] Create snapshot called.');
            let fileName = vscode.window.activeTextEditor.document.fileName;
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Creating snapshot (if the file has changed)...",
                cancellable: true
            }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
                let result = '';
                let resultErr = '';
                yield new Promise((resolve, reject) => {
                    let tmRes = child_process_1.spawn('tmutil', ['localsnapshot']);
                    tmRes.on('close', (code) => {
                        if (code !== 0)
                            return reject({ message: resultErr });
                        resolve(result.trim().split('\n'));
                    });
                    tmRes.stdout.on('data', (data) => result += data.toString('utf8'));
                    tmRes.stderr.on('data', (data) => resultErr += data.toString('utf8'));
                });
                return snapshots.localSnapshotsForFile(fileName).then(localSnaps => {
                    this.updateTreeFromSnaps(fileName, localSnaps);
                });
            }));
        });
    }
    openDiff(element) {
        vscode.commands.executeCommand(element.diffCommand.command, element.diffCommand.arguments[0], element.diffCommand.arguments[1]);
    }
}
exports.SnapshotTreeDataProvider = SnapshotTreeDataProvider;
function snapshotsToTreeItems(fileName, snapshots) {
    if (!snapshots)
        return [];
    return Object.values(snapshots)
        .map((details) => {
        let fileUri;
        let mtimeMs = details['mtimeMs'].toString().substr(0, 10);
        let fakeFileNameForEditor = `${mtimeMs}-${details['path'].split('/').pop()}`;
        if (details['local']) {
            fileUri = `timecapsule:///local${details['path']}/${fakeFileNameForEditor}`;
        }
        else {
            fileUri = `timecapsule:///backupdb${details['path']}/${fakeFileNameForEditor}`;
        }
        let uri = vscode.Uri.parse(fileUri);
        return new SnapshotTreeItem_1.SnapshotTreeItem(util_1.formatMtime(details['mtime']), details['size'] + ' bytes', util_1.formatMtimeLong(details['mtime']), fileName, mtimeMs, {
            command: 'vscode.open',
            title: fileUri,
            arguments: [uri, { preview: true }]
        }, {
            command: 'vscode.diff',
            title: fileUri,
            arguments: [vscode.window.activeTextEditor.document.uri, uri, 'title', { preview: true }]
        });
    }) || [];
}
//# sourceMappingURL=SnapshotTreeDataProvider.js.map