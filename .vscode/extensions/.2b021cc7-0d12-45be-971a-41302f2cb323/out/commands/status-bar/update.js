"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var extension_commands_1 = require("../extension-commands");
var update = function (_config, services, _utils) {
    var insights = services.insights, logger = services.logger, profiles = services.profiles;
    var statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
    statusBar.show();
    var command = extension_commands_1.StatusBarCommands.Update;
    var commandFn = function () {
        try {
            var activeProfile = profiles.get();
            statusBar.text = "GIST " + (activeProfile ? "[" + activeProfile.name + "]" : '[Create Profile]');
            statusBar.command = activeProfile
                ? extension_commands_1.ProfileCommands.Select
                : extension_commands_1.ProfileCommands.Create;
            logger.debug('Status Bar Updated');
        }
        catch (err) {
            var error = err;
            logger.error(command + " > " + (error && error.message));
            insights.exception(command, { message: error.message });
        }
    };
    return [command, commandFn];
};
exports.update = update;
//# sourceMappingURL=update.js.map