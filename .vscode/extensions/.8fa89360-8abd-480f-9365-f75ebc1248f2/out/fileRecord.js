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
const vscode_1 = require("vscode");
const path_1 = require("path");
const format = require("date-fns/format");
const fs = require("fs");
const mkdirp = require("mkdirp");
const pify = require("pify");
const fpd = require("find-parent-dir");
const mkdirpSync = require("mkdirpsync");
const mkdir = pify(mkdirp);
const writeFile = pify(fs.writeFile);
const readDir = pify(fs.readdir);
const findParentDir = pify(fpd);
class FileRecord {
    constructor() {
        const { recordPath } = vscode_1.workspace.getConfiguration('file-record');
        if (recordPath) {
            this.recordPath = path_1.resolve(recordPath);
        }
        else if (vscode_1.workspace.workspaceFolders) {
            const { fsPath } = vscode_1.workspace.workspaceFolders[0].uri;
            this.recordPath = path_1.resolve(fsPath, '.vscode/record');
        }
        if (this.recordPath) {
            mkdirpSync(this.recordPath);
            const gitignore = path_1.resolve(this.recordPath, '.gitignore');
            if (!fs.existsSync(gitignore)) {
                writeFile(gitignore, '*');
            }
        }
    }
    getLatestVersion(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dir = yield this.file(filename);
                if (dir) {
                    const files = yield readDir(dir);
                    if (files.length) {
                        files.sort((a, b) => b - a);
                        const result = /\.([0-9]+)\./.exec(files[0]);
                        return result[1];
                    }
                }
            }
            finally {
                return 0;
            }
        });
    }
    file(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (filename.includes('.vscode/record')) {
                    throw new Error('Not creating a file record of an existing file record');
                }
                if (!this.recordPath) {
                    const dir = yield findParentDir('.vscode');
                    if (dir) {
                        this.recordPath = path_1.resolve(dir, 'record');
                    }
                    else {
                        throw new Error(`Couldn't determine the project root directory`);
                    }
                }
                if (filename.includes(path_1.resolve(this.recordPath, '../..'))) {
                    const relativePath = vscode_1.workspace.asRelativePath(filename);
                    // Add .record to each path segment so that the directories that contain
                    // the records don't match the original filename exactly.
                    // https://github.com/ianwalter/file-record/issues/2
                    const pathParts = relativePath.split(path_1.sep).map(p => p + '.record');
                    return path_1.resolve(this.recordPath, pathParts.join(path_1.sep));
                }
                else {
                    throw new Error(`Filename doesn't match workspace path`);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    saveNewVersion(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirPath = yield this.file(document.fileName);
            const ext = path_1.extname(document.fileName);
            const date = format(new Date(), 'MM-DD-YYYY hh-mm-ssa');
            const filename = `${date}.${document.version}${ext}`;
            if (dirPath) {
                //
                yield mkdir(dirPath);
                //
                yield writeFile(path_1.resolve(dirPath, filename), document.getText());
            }
        });
    }
}
exports.default = FileRecord;
//# sourceMappingURL=fileRecord.js.map