"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var extension_commands_1 = require("../extension-commands");
var updateAccessKey = function (config, services, utils) {
    var gists = services.gists, insights = services.insights, logger = services.logger, profiles = services.profiles;
    var command = extension_commands_1.GistCommands.UpdateAccessKey;
    var commandFn = function () {
        try {
            var profile = profiles.get();
            var gistUrl = 'unknown';
            var overridesApplied = 'false';
            if (profile) {
                var optionOverride = {};
                var profileOptionOverride = config.get('profileOptions');
                if (profileOptionOverride &&
                    Object.keys(profileOptionOverride).length > 0 &&
                    profileOptionOverride[profile.name]) {
                    overridesApplied = 'true';
                    optionOverride = __assign({}, profileOptionOverride[profile.name]);
                }
                var key = optionOverride.key || profile.key;
                var url = optionOverride.url || (gistUrl = profile.url);
                var rejectUnauthorized = optionOverride.rejectUnauthorized || true;
                gists.configure({ key: key, url: url, rejectUnauthorized: rejectUnauthorized });
            }
            else {
                gistUrl = 'reset';
                gists.configure({
                    key: undefined,
                    rejectUnauthorized: undefined,
                    url: undefined
                });
            }
            insights.track(command, { url: gistUrl, overridesApplied: overridesApplied });
            logger.debug('updated access key');
        }
        catch (err) {
            var error = err;
            logger.error(command + " > " + (error && error.message));
            insights.exception(command, { message: error.message });
            utils.notify.error('Could Not Update Access Key', error.message);
        }
    };
    return [command, commandFn];
};
exports.updateAccessKey = updateAccessKey;
//# sourceMappingURL=update-access-key.js.map