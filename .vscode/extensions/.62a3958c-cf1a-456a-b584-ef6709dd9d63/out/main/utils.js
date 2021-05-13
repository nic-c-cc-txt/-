"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
const homedir = require('os').homedir();
function homeDir() {
    return homedir;
}
exports.homeDir = homeDir;
function homeDirPlaygroundPath() {
    return path.join(homeDir(), '.playground');
}
exports.homeDirPlaygroundPath = homeDirPlaygroundPath;
function configFilePath() {
    return path.join(homeDirPlaygroundPath(), 'config.json');
}
exports.configFilePath = configFilePath;
function getExtConfiguration() {
    let extConfig = vscode.workspace.getConfiguration('playground');
    return extConfig;
}
exports.getExtConfiguration = getExtConfiguration;
function currentDir() {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }
    else {
        return '';
    }
}
exports.currentDir = currentDir;
function currentDirPlaygroundPath() {
    return path.join(currentDir(), '.playground');
}
exports.currentDirPlaygroundPath = currentDirPlaygroundPath;
function currentDirPlaygIgnorePath() {
    return path.join(currentDir(), '.playgignore');
}
exports.currentDirPlaygIgnorePath = currentDirPlaygIgnorePath;
function playJsonPath() {
    return path.join(currentDirPlaygroundPath(), 'play.json');
}
exports.playJsonPath = playJsonPath;
function showInformation(msg, items) {
    if (items) {
        return vscode.window.showInformationMessage(msg, ...items);
    }
    else {
        return vscode.window.showInformationMessage(msg);
    }
}
exports.showInformation = showInformation;
function showError(msg, items) {
    if (items) {
        return vscode.window.showErrorMessage(msg, ...items);
    }
    else {
        return vscode.window.showErrorMessage(msg);
    }
}
exports.showError = showError;
function pathExists(path) {
    return fs.existsSync(path);
}
exports.pathExists = pathExists;
function showInputBox(options) {
    return vscode.window.showInputBox(options);
}
exports.showInputBox = showInputBox;
function showProgress(options, callback) {
    if (options) {
        options["location"] = vscode_1.ProgressLocation.Notification;
        options["cancellable"] = true;
    }
    return vscode.window.withProgress(options, callback);
}
exports.showProgress = showProgress;
function mkDir(path) {
    return fs.mkdirSync(path);
}
exports.mkDir = mkDir;
function readFile(path) {
    return fs.readFileSync(path);
}
exports.readFile = readFile;
function writeFile(path, content) {
    return fs.writeFileSync(path, content);
}
exports.writeFile = writeFile;
function isDirectory(path) {
    return fs.statSync(path).isDirectory();
}
exports.isDirectory = isDirectory;
function readAllFiles(path, arrayOfFiles) {
    arrayOfFiles = arrayOfFiles || [];
    if (isDirectory(path)) {
        let files = fs.readdirSync(path);
        files.forEach((file) => {
            if (isDirectory(path + "/" + file)) {
                return readAllFiles(path + "/" + file, arrayOfFiles);
            }
            else {
                arrayOfFiles.push(path + "/" + file);
            }
        });
    }
    else {
        arrayOfFiles.push(path);
    }
    return arrayOfFiles;
}
exports.readAllFiles = readAllFiles;
function createReadStream(path) {
    return fs.createReadStream(path);
}
exports.createReadStream = createReadStream;
function getBase64(text) {
    return Buffer.from(text).toString('base64');
}
exports.getBase64 = getBase64;
function openLink(link) {
    return vscode.env.openExternal(link);
}
exports.openLink = openLink;
function uri(path) {
    return vscode.Uri.parse(path, true);
}
exports.uri = uri;
function currentWorkspace() {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri;
    }
}
exports.currentWorkspace = currentWorkspace;
function showPicker(items, placeHolder) {
    return vscode.window.showQuickPick(items, { placeHolder: placeHolder });
}
exports.showPicker = showPicker;
function validateURL(url) {
    if (url.indexOf('http://localhost:') === -1) {
        let reg = /^(https):\/\/.*\.playg.app$/;
        return reg.test(url);
    }
    else {
        return true;
    }
}
exports.validateURL = validateURL;
function readIgnoreFile() {
    if (pathExists(currentDirPlaygIgnorePath())) {
        let playgIgnoreBuff = readFile(currentDirPlaygIgnorePath());
        let ignoreText = playgIgnoreBuff.toString();
        let splitRows = ignoreText.split(/\r?\n/);
        let ignoreList = [];
        splitRows.forEach(row => {
            //remove comments from file
            let replacedText = row.replace(/\#.*$/, '');
            if (replacedText && replacedText.length > 0) {
                ignoreList.push(replacedText.trim());
            }
        });
        return ignoreList;
    }
    else {
        console.log('No .playgignore file');
        return [];
    }
}
exports.readIgnoreFile = readIgnoreFile;
function openFile(url) {
    return vscode.window.showTextDocument(vscode.Uri.file(url));
}
exports.openFile = openFile;
//# sourceMappingURL=utils.js.map