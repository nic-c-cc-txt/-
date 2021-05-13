"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var utils = require("../utils");
var gists = require("./gists");
var profiles = require("./profiles");
var status = require("./status-bar");
var commandInitializers = [
    gists.add,
    gists.create,
    gists.createConfirmation,
    gists.deleteCommand,
    gists.deleteFile,
    gists.insert,
    gists.open,
    gists.openFavorite,
    gists.openInBrowser,
    gists.updateAccessKey,
    profiles.create,
    profiles.select,
    status.update
];
var init = function (config, services, initializers) {
    if (initializers === void 0) { initializers = commandInitializers; }
    var logger = services.logger;
    var registerCommand = function (commandInit) {
        var _a = commandInit(config, services, utils), command = _a[0], commandFn = _a[1];
        return vscode_1.commands.registerCommand(command, commandFn);
    };
    var registered = initializers.map(registerCommand);
    logger.debug('initializing commands');
    return { commandCount: registered.length, commands: registered };
};
exports.init = init;
//# sourceMappingURL=commands.js.map