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
var extension_commands_1 = require("../extension-commands");
var createConfirmation = function (_config, services, utils) {
    var insights = services.insights, logger = services.logger;
    var command = extension_commands_1.GistCommands.CreateConfirmation;
    var CommandActions;
    (function (CommandActions) {
        CommandActions["OpenInBrowser"] = "Open in Browser";
        CommandActions["CopyGistURL"] = "Copy Gist URL to Clipboard";
    })(CommandActions || (CommandActions = {}));
    var commandFn = function (gist) { return __awaiter(_this, void 0, void 0, function () {
        var url, selection, err_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = gist.url;
                    logger.info("Now presenting " + gist.description);
                    return [4, vscode_1.window.showInformationMessage('Gist Created', { title: CommandActions.OpenInBrowser }, { title: CommandActions.CopyGistURL })];
                case 1:
                    selection = _a.sent();
                    if (!selection) {
                        logger.info('User dismissed "Gist Created" dialog without action');
                        return [2];
                    }
                    if (selection.title === CommandActions.OpenInBrowser) {
                        vscode_1.commands.executeCommand(extension_commands_1.GistCommands.OpenInBrowser, gist);
                        logger.info('Opening Gist in Browser');
                        insights.track(command, { type: 'browser' });
                    }
                    else if (selection.title === CommandActions.CopyGistURL) {
                        vscode_1.env.clipboard.writeText(url);
                        logger.info('Copying Gist URL to Clipboard');
                        insights.track(command, { type: 'clipboard' });
                    }
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    error = err_1;
                    logger.error(command + " > " + (error && error.message));
                    insights.exception(command, { message: error.message });
                    utils.notify.error(error.message);
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); };
    return [command, commandFn];
};
exports.createConfirmation = createConfirmation;
//# sourceMappingURL=create-confirmation.js.map