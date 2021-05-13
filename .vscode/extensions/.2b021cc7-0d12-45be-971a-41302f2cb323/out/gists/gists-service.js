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
var Octokit = require("@octokit/rest");
var https = require("https");
var constants_1 = require("../constants");
var DEFAULT_OPTIONS = {
    baseUrl: constants_1.GISTS_BASE_URL
};
var GistsService = (function () {
    function GistsService() {
        this.options = DEFAULT_OPTIONS;
        this.octokit = new Octokit(this.options);
    }
    GistsService.prototype.configure = function (options) {
        var key = options.key || '';
        var url = options.url || 'https://api.github.com';
        var rejectUnauthorized = options.rejectUnauthorized || true;
        var agent = new https.Agent({ rejectUnauthorized: rejectUnauthorized });
        var config = { baseUrl: url, agent: agent };
        this.options = config || this.options;
        this.octokit = new Octokit(this.options);
        if (key) {
            this.octokit.authenticate({ type: 'token', token: key });
        }
    };
    GistsService.prototype.create = function (params) {
        return this.octokit.gists.create(params);
    };
    GistsService.prototype.delete = function (params) {
        return this.octokit.gists.delete(params);
    };
    GistsService.prototype.get = function (params) {
        return this.octokit.gists.get(__assign({}, params));
    };
    GistsService.prototype.list = function (params) {
        return this.octokit.gists.list(__assign({}, params));
    };
    GistsService.prototype.listStarred = function (params) {
        return this.octokit.gists.listStarred(__assign({}, params));
    };
    GistsService.prototype.update = function (params) {
        return this.octokit.gists.update(params);
    };
    GistsService.getInstance = function () {
        return GistsService.instance ? GistsService.instance : new GistsService();
    };
    return GistsService;
}());
exports.gists = GistsService.getInstance();
//# sourceMappingURL=gists-service.js.map