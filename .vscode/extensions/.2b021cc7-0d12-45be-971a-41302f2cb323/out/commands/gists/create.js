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
var utils_1 = require("./utils");
var create = function (config, services, utils) {
    var gists = services.gists, insights = services.insights, logger = services.logger;
    var command = extension_commands_1.GistCommands.Create;
    var commandFn = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, gistName, editor, selection, content, tmpFilename, filename, description, defaultValue, isPublic, gist, err_1, context_1, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    gistName = '';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    editor = vscode_1.window.activeTextEditor;
                    if (!editor) {
                        throw new Error('Open a file before creating');
                    }
                    selection = editor.selection;
                    content = editor.document.getText(selection.isEmpty ? undefined : selection);
                    tmpFilename = utils.files.getFileName(editor.document);
                    return [4, utils.input.prompt('Enter filename', tmpFilename)];
                case 2:
                    filename = (_b.sent()) ||
                        tmpFilename;
                    return [4, utils.input.prompt('Enter description')];
                case 3:
                    description = _b.sent();
                    defaultValue = config.get('defaultPrivate') ? 'N' : 'Y';
                    return [4, utils.input.prompt('Public? Y = Yes, N = No', defaultValue)];
                case 4:
                    isPublic = ((_b.sent()) ||
                        defaultValue)
                        .slice(0, 1)
                        .toLowerCase() === 'y';
                    gistName = description || filename;
                    return [4, gists.createGist((_a = {}, _a[filename] = { content: content }, _a), description, isPublic)];
                case 5:
                    gist = _b.sent();
                    return [4, utils_1.openGist(gist, config.get('maxFiles'))];
                case 6:
                    _b.sent();
                    return [4, vscode_1.commands.executeCommand(extension_commands_1.GistCommands.CreateConfirmation, gist)];
                case 7:
                    _b.sent();
                    return [3, 9];
                case 8:
                    err_1 = _b.sent();
                    context_1 = gistName ? " " + gistName : '';
                    error = err_1;
                    logger.error(command + " > " + (error && error.message));
                    insights.exception(command, { message: error.message });
                    utils.notify.error("Could Not Create" + context_1, "Reason: " + error.message);
                    return [3, 9];
                case 9: return [2];
            }
        });
    }); };
    return [command, commandFn];
};
exports.create = create;
//# sourceMappingURL=create.js.map