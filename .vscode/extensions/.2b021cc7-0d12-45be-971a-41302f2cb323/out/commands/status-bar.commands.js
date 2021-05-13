"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var insights_1 = require("../insights");
var logger_1 = require("../logger");
var profiles_1 = require("../profiles");
var statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
statusBar.show();
exports.updateStatusBar = function () {
    try {
        var activeProfile = profiles_1.profiles.get();
        statusBar.text = "GIST " + (activeProfile ? "[" + activeProfile.name + "]" : '[Create Profile]');
        statusBar.command = activeProfile
            ? 'extension.toggleProfile'
            : 'extension.createProfile';
        logger_1.logger.debug('Status Bar Updated');
    }
    catch (err) {
        var error = err;
        logger_1.logger.error("updateStatusBar > " + (error && error.message));
        insights_1.insights.exception('updateStatusBar', { messsage: error.message });
    }
};
//# sourceMappingURL=status-bar.commands.js.map