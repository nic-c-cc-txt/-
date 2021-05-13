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
var vscode_1 = require("vscode");
var ProfileService = (function () {
    function ProfileService() {
        this.state = vscode_1.workspace.getConfiguration();
    }
    ProfileService.prototype.add = function (name, key, url, active) {
        if (url === void 0) { url = 'https://api.github.com'; }
        if (active === void 0) { active = false; }
        var _a;
        var p = this.getRawProfiles();
        var currentState = Object.keys(p)
            .map(function (profile) {
            var _a;
            return (_a = {},
                _a[profile] = { key: p[profile].key, url: p[profile].url, active: false },
                _a);
        })
            .reduce(function (prev, curr) { return (__assign({}, prev, curr)); }, {});
        this.state.update('profiles', __assign({}, currentState, (_a = {}, _a[name] = { active: active, key: key, url: url }, _a)));
    };
    ProfileService.prototype.configure = function (options) {
        var state = options.state;
        this.state = state;
    };
    ProfileService.prototype.get = function () {
        var currentProfile = this.getAll().filter(function (p) { return p.active; });
        return currentProfile[0] || undefined;
    };
    ProfileService.prototype.getAll = function () {
        var p = this.getRawProfiles();
        return Object.keys(p).map(function (profileName) { return ({
            active: p[profileName].active,
            key: p[profileName].key,
            name: profileName,
            url: p[profileName].url
        }); });
    };
    ProfileService.prototype.reset = function () {
        this.state.update('profiles', undefined);
    };
    ProfileService.prototype.getRawProfiles = function () {
        return this.state.get('profiles', {});
    };
    ProfileService.getInstance = function () {
        return ProfileService.instance ? ProfileService.instance : new ProfileService();
    };
    return ProfileService;
}());
exports.profiles = ProfileService.getInstance();
//# sourceMappingURL=profile-service.js.map