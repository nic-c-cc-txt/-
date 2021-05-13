"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var commands_1 = require("./commands");
var extension_commands_1 = require("./commands/extension-commands");
var constants_1 = require("./constants");
var gists = require("./gists");
var insights_1 = require("./insights");
var listeners_1 = require("./listeners");
var logger_1 = require("./logger");
var migrations_1 = require("./migrations");
var profiles_1 = require("./profiles");
var disposables = {
    commands: [],
    listeners: []
};
function activate(context) {
    logger_1.logger.setLevel(constants_1.DEBUG ? logger_1.Levels.DEBUG : logger_1.Levels.ERROR);
    logger_1.logger.setOutput(vscode_1.window.createOutputChannel('Gist'));
    logger_1.logger.debug('extension activated');
    migrations_1.migrations.configure({
        migrations: migrations_1.extensionMigrations,
        state: context.globalState
    });
    profiles_1.profiles.configure({ state: context.globalState });
    var config = vscode_1.workspace.getConfiguration('gist');
    var extension = vscode_1.extensions.getExtension(constants_1.EXTENSION_ID);
    var previousVersion = context.globalState.get('version');
    var currentVersion = extension.packageJSON.version;
    var extCommands = commands_1.init(config, {
        gists: gists,
        insights: insights_1.insights,
        logger: logger_1.logger,
        profiles: profiles_1.profiles
    });
    var extListeners = listeners_1.init(config, {
        gists: gists,
        insights: insights_1.insights,
        logger: logger_1.logger,
        profiles: profiles_1.profiles
    });
    disposables.commands = extCommands.commands;
    disposables.listeners = extListeners.listeners;
    vscode_1.commands.registerCommand('extension.resetState', function () {
        context.globalState.update('gisttoken', undefined);
        context.globalState.update('gist_provider', undefined);
        context.globalState.update('profiles', undefined);
        context.globalState.update('migrations', undefined);
        vscode_1.commands.executeCommand(extension_commands_1.StatusBarCommands.Update);
        vscode_1.commands.executeCommand(extension_commands_1.GistCommands.UpdateAccessKey);
    });
    migrations_1.migrations.up(function (err, results) {
        vscode_1.commands.executeCommand(extension_commands_1.StatusBarCommands.Update);
        vscode_1.commands.executeCommand(extension_commands_1.GistCommands.UpdateAccessKey);
        if (err) {
            insights_1.insights.exception('migrations', { message: err.message });
        }
        if (previousVersion !== currentVersion) {
            context.globalState.update('version', currentVersion);
        }
        insights_1.insights.track('activated', undefined, {
            commandCount: extCommands.commandCount,
            listenerCount: extListeners.listenerCount,
            migrationCount: results.migrated.length
        });
    });
}
exports.activate = activate;
function deactivate() {
    disposables.commands.forEach(function (d) { return d.dispose(); });
    disposables.listeners.forEach(function (d) { return d.dispose(); });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map