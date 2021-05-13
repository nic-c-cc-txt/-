"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var _notify = function (type) {
    var messages = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        messages[_i - 1] = arguments[_i];
    }
    var formattedMessage = messages.slice().filter(function (m) { return typeof m !== 'undefined'; })
        .join(' > ');
    switch (type) {
        case 'error':
            vscode_1.window.showErrorMessage("GIST ERROR: " + formattedMessage);
            break;
        case 'info':
            vscode_1.window.showInformationMessage("GIST: " + formattedMessage);
            break;
        default:
    }
};
exports.error = function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    _notify.apply(void 0, ['error'].concat(messages));
};
exports.info = function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    _notify.apply(void 0, ['info'].concat(messages));
};
//# sourceMappingURL=notify.js.map