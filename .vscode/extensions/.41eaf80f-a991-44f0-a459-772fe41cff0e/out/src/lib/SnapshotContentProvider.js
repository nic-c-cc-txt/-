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
const fs = require("fs");
const child_process_1 = require("child_process");
exports.SnapshotContentProvider = new class {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    provideTextDocumentContent(uri) {
        // mount the path specified in the uri, copy the file, then unmount it
        let parts = uri.path.split('/');
        parts.shift();
        let snapshotMountPoint = '/' + parts[0] + "/" + parts[1];
        let snapshot = parts[1].replace('ssvscode-', '');
        parts.shift();
        parts.shift();
        parts.pop();
        let filePath = '/' + parts.join('/');
        child_process_1.spawnSync('mkdir', [snapshotMountPoint]);
        child_process_1.spawnSync('mount_apfs', ['-s', snapshot, '/', snapshotMountPoint], { encoding: 'utf8' });
        let exists = fs.existsSync(snapshotMountPoint + filePath);
        if (!exists) {
            child_process_1.spawnSync('diskutil', ['unmount', snapshotMountPoint]);
            return 'Local snapshot no longer exists, it may have moved to external storage. Please refresh the snapshot list.';
        }
        let contents = fs.readFileSync(snapshotMountPoint + filePath);
        child_process_1.spawnSync('diskutil', ['unmount', snapshotMountPoint]);
        child_process_1.spawnSync('rmdir', [snapshotMountPoint]);
        return contents.toString('utf8');
    }
};
exports.snapshotOpenCommand = vscode.commands.registerCommand('snapshot.open', (uri) => __awaiter(this, void 0, void 0, function* () {
    let doc = yield vscode.workspace.openTextDocument(uri);
    yield vscode.window.showTextDocument(doc, { preview: false });
}));
//# sourceMappingURL=SnapshotContentProvider.js.map