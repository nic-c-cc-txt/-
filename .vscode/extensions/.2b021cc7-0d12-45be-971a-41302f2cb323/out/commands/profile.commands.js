"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var insights_1 = require("../insights");
var logger_1 = require("../logger");
var profiles_1 = require("../profiles");
var utils_1 = require("../utils");
exports.createProfile = function () { return __awaiter(_this, void 0, void 0, function () {
    var title, url, _a, key, name_1, err_1, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                return [4, vscode_1.window.showInformationMessage('Which GitHub Platform?', { modal: true }, { title: 'GitHub.com (common)', isCloseAffordance: true }, { title: 'GitHub Enterprise' })];
            case 1:
                title = (_b.sent()).title;
                if (!(title === 'GitHub Enterprise')) return [3, 3];
                return [4, vscode_1.window.showInputBox({ prompt: 'Enter your enterprise API url' })];
            case 2:
                _a = _b.sent();
                return [3, 4];
            case 3:
                _a = 'https://api.github.com';
                _b.label = 4;
            case 4:
                url = _a;
                if (!url) {
                    logger_1.logger.debug('User Aborted Create Profile at "url"');
                    return [2];
                }
                return [4, vscode_1.window.showInputBox({
                        prompt: 'Enter your access token'
                    })];
            case 5:
                key = _b.sent();
                if (!key) {
                    logger_1.logger.debug('User Aborted Create Profile at "key"');
                    return [2];
                }
                return [4, vscode_1.window.showInputBox({
                        prompt: 'Give this profile a name'
                    })];
            case 6:
                name_1 = _b.sent();
                if (!name_1) {
                    logger_1.logger.debug('User Aborted Create Profile at "name"');
                    return [2];
                }
                profiles_1.profiles.add(name_1, key, url, true);
                return [4, vscode_1.commands.executeCommand('extension.status.update')];
            case 7:
                _b.sent();
                return [4, vscode_1.commands.executeCommand('extension.gist.updateAccessKey')];
            case 8:
                _b.sent();
                insights_1.insights.track('createProfile');
                return [3, 10];
            case 9:
                err_1 = _b.sent();
                error = err_1;
                logger_1.logger.error("createProfile > " + (error && error.message));
                insights_1.insights.exception('createProfile', { messsage: error.message });
                utils_1.notify.error('Unable To Create Profile', error.message);
                return [3, 10];
            case 10: return [2];
        }
    });
}); };
exports.selectProfile = function () { return __awaiter(_this, void 0, void 0, function () {
    var allProfiles, qp, createProfileItem, selected, _a, key, name_2, url, err_2, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                allProfiles = profiles_1.profiles.getAll();
                if (!allProfiles || allProfiles.length === 0) {
                    vscode_1.commands.executeCommand('extension.createProfile');
                    return [2];
                }
                qp = allProfiles.map(function (profile) { return ({
                    label: profile.name,
                    profile: profile
                }); });
                createProfileItem = {
                    label: 'Create New Profile'
                };
                return [4, vscode_1.window.showQuickPick([
                        createProfileItem
                    ].concat(qp))];
            case 1:
                selected = (_b.sent());
                if (!selected) {
                    return [2];
                }
                if (selected && selected.label !== 'Create New Profile') {
                    _a = selected.profile, key = _a.key, name_2 = _a.name, url = _a.url;
                    profiles_1.profiles.add(name_2, key, url, true);
                    vscode_1.commands.executeCommand('extension.status.update');
                    vscode_1.commands.executeCommand('extension.gist.updateAccessKey');
                    insights_1.insights.track('slectProfile');
                }
                else {
                    vscode_1.commands.executeCommand('extension.createProfile');
                }
                return [3, 3];
            case 2:
                err_2 = _b.sent();
                error = err_2;
                logger_1.logger.error("selectProfile > " + (error && error.message));
                insights_1.insights.exception('selectProfile', { messsage: error.message });
                utils_1.notify.error('Unable To Select Profile', error.message);
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=profile.commands.js.map