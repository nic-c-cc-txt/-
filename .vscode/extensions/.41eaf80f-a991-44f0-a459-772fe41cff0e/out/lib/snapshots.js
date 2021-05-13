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
const plist = require("plist");
const child_process_1 = require("child_process");
const date_fns_1 = require("date-fns");
const timeCapsule_1 = require("../timeCapsule");
function localSnapshotsForFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let filesFound = {};
        // To find out if this file is in any local snapshots,
        // we have to first get a list of snapshots using
        // `tmutil listlocalsnapshots /`
        let snapshots = child_process_1.spawnSync('tmutil', ['listlocalsnapshots', '/']);
        let snaps = snapshots.stdout.toString().trim().split('\n');
        snaps.shift();
        let files = yield Promise.all(snaps.map((snap) => __awaiter(this, void 0, void 0, function* () {
            let mountedSnapPath = `/tmp/ssvscode-${snap}`;
            child_process_1.spawnSync('mkdir', [mountedSnapPath]);
            // then we mount each of them
            let spawnResult = child_process_1.spawnSync('mount_apfs', ['-s', snap, '/', mountedSnapPath], { encoding: 'utf8' });
            let exists = fs.existsSync(mountedSnapPath + path);
            if (!exists) {
                child_process_1.spawnSync('diskutil', ['unmount', mountedSnapPath]);
                child_process_1.spawnSync('rmdir', [mountedSnapPath]);
                return Promise.resolve();
            }
            ;
            // then we check that path for the file, stat it, and then
            // `diskutil unmount /tmp/snapshot1/`
            let stats = fs.statSync(mountedSnapPath + path);
            child_process_1.spawnSync('diskutil', ['unmount', mountedSnapPath]);
            child_process_1.spawnSync('rmdir', [mountedSnapPath]);
            return Promise.resolve({ path: mountedSnapPath, stats, local: true });
        })));
        let uniqueFiles = {};
        files.filter(f => !!f).forEach(file => {
            let ms = file['stats']['mtimeMs'].toString().substr(0, 10);
            uniqueFiles[ms + file['stats']['size'].toString()] = {
                path: `${file['path']}${vscode.window.activeTextEditor.document.fileName}`,
                mtime: file['stats']['mtime'],
                mtimeMs: file['stats']['mtimeMs'],
                size: file['stats']['size'],
                local: file['local']
            };
        });
        return uniqueFiles;
    });
}
function formatMtime(mtime) {
    let formattedDate = date_fns_1.formatRelative(mtime, new Date());
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    return formattedDate;
}
function childrenForVersions(versions) {
    return Object.values(versions)
        .sort((a, b) => {
        return a['mtime'] < b['mtime'] ? 1 : -1;
    })
        .map((details) => {
        let fileUri;
        if (details['local']) {
            fileUri = `tcsnapshot://${details['path']}/${details['mtimeMs'].toString().substr(0, 10)}-${details['path'].split('/').pop()}`;
        }
        else {
            fileUri = `file://${details['path']}`;
        }
        let uri = vscode.Uri.parse(fileUri);
        return new timeCapsule_1.SnapshotTreeItem(formatMtime(details['mtime']), details['size'] + ' bytes', details.toString(), {
            command: details['local'] ? 'snapshot.open' : 'vscode.open',
            title: fileUri,
            arguments: [uri, { preview: false }]
        }, {
            command: 'vscode.diff',
            title: fileUri,
            arguments: [vscode.window.activeTextEditor.document.uri, uri, 'title', { preview: false }]
        });
    });
}
function listBackups() {
    let backups = '';
    return new Promise((resolve, reject) => {
        child_process_1.spawn('tmutil', ['listbackups']).on('close', (code) => {
            if (code !== 0)
                return reject(code);
            resolve(backups.trim().split('\n'));
        }).stdout.on('data', (data) => {
            backups += data.toString('utf8');
        });
    });
}
function listInternalDisks() {
    let xml = '';
    return new Promise(function (resolve, reject) {
        child_process_1.spawn('diskutil', ['list', '-plist', 'internal', 'virtual']).on('close', (code) => {
            if (code !== 0)
                return reject(code);
            try {
                let parsed = plist.parse(xml);
                resolve(parsed);
            }
            catch (error) {
                reject(error.message);
            }
        }).stdout.on('data', (data) => {
            xml += data.toString('utf8');
        });
    });
}
function backupsWithThisFile(backups, volumes) {
    let fileVersions = {};
    let amountToFill = 0;
    let filledCount = 0;
    return new Promise(function (resolve, reject) {
        backups.forEach(backup => {
            let versionPath = `${backup}/${volumes[0]}${vscode.window.activeTextEditor.document.fileName}`;
            fs.exists(versionPath, (exists) => {
                if (!exists)
                    return;
                amountToFill += 1;
                fs.stat(versionPath, (err, stats) => {
                    if (err)
                        return reject('Error getting file info.');
                    fileVersions[stats['mtimeMs'].toString().substr(0, 10) + stats['size'].toString()] = {
                        path: versionPath, size: stats.size, mtime: stats.mtime
                    };
                    filledCount += 1;
                    if (filledCount === amountToFill) {
                        resolve(fileVersions);
                    }
                });
            });
        });
    });
}
function getTreeChildren() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let localSnaps = yield localSnapshotsForFile(vscode.window.activeTextEditor.document.fileName);
        let disks = yield listInternalDisks();
        let backups = yield listBackups();
        if (!backups.length)
            return resolve([]);
        let volumes = disks && disks['VolumesFromDisks'] && disks['VolumesFromDisks'].filter(disk => disk.endsWith('- Data'));
        if (!volumes.length)
            return resolve([]);
        let fileVersions = yield backupsWithThisFile(backups, volumes);
        if (!Object.keys(fileVersions).length)
            return resolve([]);
        let entries = childrenForVersions(Object.assign({}, fileVersions, localSnaps));
        resolve(entries);
    }));
}
exports.getTreeChildren = getTreeChildren;
//# sourceMappingURL=snapshots.js.map