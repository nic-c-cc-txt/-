"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var Levels;
(function (Levels) {
    Levels[Levels["DEBUG"] = 0] = "DEBUG";
    Levels[Levels["INFO"] = 1] = "INFO";
    Levels[Levels["WARN"] = 2] = "WARN";
    Levels[Levels["ERROR"] = 3] = "ERROR";
})(Levels = exports.Levels || (exports.Levels = {}));
var Logger = (function () {
    function Logger(level) {
        this.level = level;
    }
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level === Levels.DEBUG) {
            this.log.apply(this, ['debug'].concat(args));
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= Levels.ERROR) {
            this.log.apply(this, ['error'].concat(args));
        }
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= Levels.INFO) {
            this.log.apply(this, ['info'].concat(args));
        }
    };
    Logger.prototype.setLevel = function (level) {
        this.level = level;
    };
    Logger.prototype.setOutput = function (output) {
        this.output = output;
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= Levels.WARN) {
            this.log.apply(this, ['warn'].concat(args));
        }
    };
    Logger.prototype.log = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var prefix = "vscode-gist>" + method + ":";
        var message = args.slice().join(' > ');
        if (this.output) {
            this.output.appendLine(prefix + " " + message);
        }
    };
    Logger.getInstance = function () {
        return (Logger.instance = Logger.instance
            ? Logger.instance
            :
                new Logger(constants_1.LOGGER_LEVEL));
    };
    return Logger;
}());
exports.logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map