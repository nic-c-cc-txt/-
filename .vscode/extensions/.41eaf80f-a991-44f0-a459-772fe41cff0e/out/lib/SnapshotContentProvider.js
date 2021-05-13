"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const child_process_1 = require("child_process");
const util_1 = require("../util");
exports.SnapshotContentProvider = new class {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    provideTextDocumentContent(uri) {
        let parts = uri.path.split('/');
        parts.shift();
        let snapshotType = parts.shift();
        if (snapshotType === 'backupdb') {
            // For files in the backup db, we just copy them out from the path in /Volumes/...
            parts.pop();
            let filePath = '/' + parts.join('/');
            let contents = fs.readFileSync(filePath);
            return contents.toString('utf8');
        }
        else if (snapshotType === 'local') {
            let snapshotMountPoint = '/' + parts[0] + "/" + parts[1];
            let snapshot = parts[1].replace('ssvscode-', '');
            parts.shift();
            parts.shift();
            parts.pop();
            let filePath = '/' + parts.join('/');
            // For local snapshots, mount the APFS snapshot specified in the uri, copy the file, then unmount it
            child_process_1.spawnSync('mkdir', [snapshotMountPoint]);
            let mountResult = child_process_1.spawnSync('mount_apfs', ['-s', snapshot, '/', snapshotMountPoint], { encoding: 'utf8' });
            let exists = fs.existsSync(snapshotMountPoint + filePath);
            if (!exists) {
                let errMessage = `
					Local snapshot no longer exists, it may have moved to external storage.
					STDOUT: ${mountResult.stdout.toString()}
					\n\n
					STDERR: ${mountResult.stderr.toString()}
				`;
                util_1.errorHandler({ message: errMessage });
                child_process_1.spawnSync('diskutil', ['unmount', snapshotMountPoint]);
            }
            let contents = fs.readFileSync(snapshotMountPoint + filePath);
            child_process_1.spawnSync('diskutil', ['unmount', snapshotMountPoint]);
            child_process_1.spawnSync('rmdir', [snapshotMountPoint]);
            return contents.toString('utf8');
        }
    }
};
//# sourceMappingURL=SnapshotContentProvider.js.map