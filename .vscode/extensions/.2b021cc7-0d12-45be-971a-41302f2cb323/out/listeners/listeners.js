"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var utils = require("../utils");
var extension_listeners_1 = require("./extension-listeners");
var on_did_save_text_document_1 = require("./on-did-save-text-document");
var listenerInitializers = [on_did_save_text_document_1.onDidSaveTextDocument];
var init = function (config, services, initializers) {
    if (initializers === void 0) { initializers = listenerInitializers; }
    var logger = services.logger;
    var registerListener = function (listenerInit) {
        var _a = listenerInit(config, services, utils), listenerIndex = _a[0], listenerFn = _a[1];
        var listener = extension_listeners_1.getListener(listenerIndex);
        switch (listener) {
            case 'onDidChangeConfiguration':
                return vscode_1.workspace.onDidChangeConfiguration(listenerFn);
            case 'onDidChangeTextDocument':
                return vscode_1.workspace.onDidChangeTextDocument(listenerFn);
            case 'onDidChangeWorkspaceFolders':
                return vscode_1.workspace.onDidChangeWorkspaceFolders(listenerFn);
            case 'onDidCloseTextDocument':
                return vscode_1.workspace.onDidCloseTextDocument(listenerFn);
            case 'onDidOpenTextDocument':
                return vscode_1.workspace.onDidOpenTextDocument(listenerFn);
            case 'onDidSaveTextDocument':
                return vscode_1.workspace.onDidSaveTextDocument(listenerFn);
            case 'onWillSaveTextDocument':
                return vscode_1.workspace.onWillSaveTextDocument(listenerFn);
            default:
                throw new Error('invalid listener');
        }
    };
    var registered = initializers.map(registerListener);
    logger.debug('initializing listeners');
    return { listenerCount: registered.length, listeners: registered };
};
exports.init = init;
//# sourceMappingURL=listeners.js.map