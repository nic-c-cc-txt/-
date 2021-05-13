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
const fs = require("fs");
const plist = require("plist");
const child_process_1 = require("child_process");
function localSnapshotsForFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        // To find out if this file is in any local snapshots,
        // we have to first get a list of snapshots using
        // `tmutil listlocalsnapshots /`
        let snapshots = child_process_1.spawnSync('tmutil', ['listlocalsnapshots', '/']);
        let snaps = snapshots.stdout.toString().trim().split('\n');
        snaps.shift();
        console.info(`[INFO] Getting local snapshots for file ${fileName}`);
        let files = yield Promise.all(snaps.map((snap) => __awaiter(this, void 0, void 0, function* () {
            let mountedSnapPath = `/tmp/ssvscode-${snap}`;
            child_process_1.spawnSync('mkdir', [mountedSnapPath]);
            // then we mount each of them
            let spawnResult = child_process_1.spawnSync('mount_apfs', ['-s', snap, '/', mountedSnapPath], { encoding: 'utf8' });
            let exists = fs.existsSync(mountedSnapPath + fileName);
            if (!exists) {
                child_process_1.spawnSync('diskutil', ['unmount', mountedSnapPath]);
                child_process_1.spawnSync('rmdir', [mountedSnapPath]);
                return Promise.resolve();
            }
            // then we check that path for the file, stat it, and then
            // `diskutil unmount /tmp/snapshot1/`
            let stats = fs.statSync(mountedSnapPath + fileName);
            child_process_1.spawnSync('diskutil', ['unmount', mountedSnapPath]);
            child_process_1.spawnSync('rmdir', [mountedSnapPath]);
            return Promise.resolve({ path: mountedSnapPath, stats, local: true });
        }))).catch(err => {
            throw err;
        });
        let uniqueFiles = {};
        files.filter(f => !!f).forEach(file => {
            let ms = file['stats']['mtimeMs'].toString().substr(0, 10);
            uniqueFiles[ms + file['stats']['size'].toString()] = {
                path: `${file['path']}${fileName}`,
                mtime: file['stats']['mtime'],
                mtimeMs: ms,
                size: file['stats']['size'],
                local: file['local']
            };
        });
        console.info(`[INFO] Got local snapshots...`);
        return uniqueFiles;
    });
}
exports.localSnapshotsForFile = localSnapshotsForFile;
function listBackups() {
    let backups = '';
    let backupsErr = '';
    console.info(`[INFO] Listing backups...`);
    return new Promise((resolve, reject) => {
        let tmRes = child_process_1.spawn('tmutil', ['listbackups']);
        tmRes.on('close', (code) => {
            if (code !== 0) {
                return reject({ message: backupsErr, code });
            }
            console.info(`[INFO] Got backups...`);
            resolve(backups.trim().split('\n'));
        });
        tmRes.stdout.on('data', (data) => {
            backups += data.toString('utf8');
        });
        tmRes.stderr.on('data', (data) => {
            backupsErr += data.toString('utf8');
        });
    });
}
function listInternalDisks() {
    let xml = '';
    let xmlErr = '';
    console.info(`[INFO] Listing internal disks...`);
    return new Promise(function (resolve, reject) {
        let diskRes = child_process_1.spawn('diskutil', ['list', '-plist', 'internal', 'virtual']);
        diskRes.on('close', (code) => {
            if (code !== 0) {
                debugger;
                return reject({ message: xmlErr, code });
            }
            console.info(`[INFO] Got internal disks...`);
            try {
                let parsed = plist.parse(xml);
                resolve(parsed);
            }
            catch (error) {
                reject(error);
            }
        });
        diskRes.stdout.on('data', (data) => {
            xml += data.toString('utf8');
        });
        diskRes.stderr.on('data', (data) => {
            console.log(data.toString('utf8'));
            xmlErr += data.toString('utf8');
        });
    });
}
function dbSnapshotsForFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let disks = yield listInternalDisks();
        let backups = yield listBackups();
        if (!backups.length)
            return;
        let volumes = disks && disks['VolumesFromDisks'] && disks['VolumesFromDisks'].filter(disk => disk.endsWith('- Data'));
        if (!volumes.length)
            return;
        let fileVersions = {};
        let amountToFill = 0;
        let filledCount = 0;
        console.info(`[INFO] Finding which backups have this file...`);
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < backups.length; i++) {
                let backup = backups[i];
                let versionPath = `${backup}/${volumes[0]}${fileName}`;
                fs.exists(versionPath, (exists) => {
                    if (!exists)
                        return;
                    amountToFill += 1;
                    fs.stat(versionPath, (err, stats) => {
                        if (err)
                            return reject('Error getting file info.');
                        fileVersions[stats['mtimeMs'].toString().substr(0, 10) + stats['size'].toString()] = {
                            path: versionPath, size: stats.size, mtime: stats.mtime, mtimeMs: stats.mtimeMs
                        };
                        filledCount += 1;
                        if (filledCount === amountToFill) {
                            console.info(`[INFO] Found which backups have this file...`);
                            resolve(fileVersions);
                        }
                    });
                });
            }
        });
    });
}
exports.dbSnapshotsForFile = dbSnapshotsForFile;
//# sourceMappingURL=snapshots.js.map