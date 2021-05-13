"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const date_fns_1 = require("date-fns");
const child_process_1 = require("child_process");
const extension_1 = require("./extension");
function cleanup() {
    child_process_1.spawnSync('diskutil', ['unmount', `/tmp/ssvscode-*`]);
    child_process_1.spawnSync('rmdir', [`/tmp/ssvscode-*`]);
}
exports.cleanup = cleanup;
function formatMtime(mtime) {
    let formattedDate = date_fns_1.formatRelative(mtime, new Date());
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    return formattedDate;
}
exports.formatMtime = formatMtime;
function formatMtimeLong(mtime) {
    let formattedDate = date_fns_1.format(mtime, 'PPPPpppp');
    return formattedDate;
}
exports.formatMtimeLong = formatMtimeLong;
function errorHandler(error) {
    console.error(error);
    if (!error) {
        extension_1.reporter.sendTelemetryEvent("error");
        return;
    }
    if (typeof error === 'string') {
        extension_1.reporter.sendTelemetryEvent("error", { message: error });
        return;
    }
    if (error.code === 80) {
        vscode.window.showWarningMessage("Time Capsule requires Full Disk Access privileges. To allow this operation, select Full Disk Access in the Privacy tab of the Security & Privacy preference pane, and add Code to the list of applications which are allowed Full Disk Access.");
        return;
    }
    let message = error.message || JSON.stringify(error);
    vscode.window.showErrorMessage(message);
    extension_1.reporter.sendTelemetryEvent("error", { message, stack: error.stack || undefined });
    extension_1.reporter.sendTelemetryException(error);
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=util.js.map