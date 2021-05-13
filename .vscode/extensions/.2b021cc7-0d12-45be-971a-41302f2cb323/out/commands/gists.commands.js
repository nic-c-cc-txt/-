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
var gists_1 = require("../gists");
var insights_1 = require("../insights");
var logger_1 = require("../logger");
var profiles_1 = require("../profiles");
var utils_1 = require("../utils");
var _formatGistsForQuickPick = function (gists) {
    return gists.map(function (item, i, j) { return ({
        block: item,
        description: (item.public ? 'PUBLIC' : 'PRIVATE') + " - Files: " + item.fileCount + " - Created: " + item.createdAt + " - Updated: " + item.updatedAt,
        label: j.length - i + ". " + item.name
    }); });
};
var _getGists = function (favorite) {
    if (favorite === void 0) { favorite = false; }
    return __awaiter(_this, void 0, void 0, function () {
        var items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, gists_1.getGists(favorite)];
                case 1:
                    items = _a.sent();
                    return [2, _formatGistsForQuickPick(items || [])];
            }
        });
    });
};
var _openDocument = function (file) { return __awaiter(_this, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, vscode_1.workspace.openTextDocument(file)];
            case 1:
                doc = _a.sent();
                return [4, vscode_1.window.showTextDocument(doc)];
            case 2:
                _a.sent();
                vscode_1.commands.executeCommand('workbench.action.keepEditor');
                return [2];
        }
    });
}); };
var _openCodeBlock = function (gistId) { return __awaiter(_this, void 0, void 0, function () {
    var _a, id, files, fileCount, filePaths, _i, filePaths_1, filePath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, gists_1.getGist(gistId)];
            case 1:
                _a = _b.sent(), id = _a.id, files = _a.files, fileCount = _a.fileCount;
                filePaths = utils_1.filesSync(id, files);
                _i = 0, filePaths_1 = filePaths;
                _b.label = 2;
            case 2:
                if (!(_i < filePaths_1.length)) return [3, 5];
                filePath = filePaths_1[_i];
                return [4, _openDocument(filePath)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3, 2];
            case 5: return [2, { id: id, files: files, fileCount: fileCount }];
        }
    });
}); };
var openCodeBlock = function (favorite) {
    if (favorite === void 0) { favorite = false; }
    return __awaiter(_this, void 0, void 0, function () {
        var gistName, gists, selected, fileCount, err_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gistName = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    logger_1.logger.info("User Activated " + (!favorite ? 'openCodeBlock' : 'openFavoriteCodeBlock'));
                    return [4, _getGists(favorite)];
                case 2:
                    gists = _a.sent();
                    return [4, vscode_1.window.showQuickPick(gists)];
                case 3:
                    selected = _a.sent();
                    if (!selected) return [3, 5];
                    gistName = "\"" + selected.block.name + "\"";
                    logger_1.logger.info("User Selected Gist: \"" + selected.label + "\"");
                    return [4, _openCodeBlock(selected.block.id)];
                case 4:
                    fileCount = (_a.sent()).fileCount;
                    logger_1.logger.info('Opened Gist');
                    insights_1.insights.track('open', undefined, {
                        fileCount: fileCount,
                        isFavorite: Number(favorite)
                    });
                    _a.label = 5;
                case 5: return [3, 7];
                case 6:
                    err_1 = _a.sent();
                    error = err_1;
                    logger_1.logger.error("openCodeBlock > " + (error && error.message));
                    insights_1.insights.exception('openCodeBlock', { messsage: error.message });
                    if (error && error.message === 'Not Found') {
                        utils_1.notify.error("Could Not Open Gist " + gistName, "Reason: " + error.message);
                    }
                    else {
                        utils_1.notify.error('Unable To Open Gists', error.message);
                    }
                    return [3, 7];
                case 7: return [2];
            }
        });
    });
};
exports.openCodeBlock = openCodeBlock;
var openFavoriteCodeBlock = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, openCodeBlock(true)];
}); }); };
exports.openFavoriteCodeBlock = openFavoriteCodeBlock;
var updateCodeBlock = function (doc) { return __awaiter(_this, void 0, void 0, function () {
    var file, editor, _a, id, filename, content, language, err_2, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                file = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                editor = vscode_1.window.activeTextEditor;
                _a = utils_1.extractTextDocumentDetails(doc, editor), id = _a.id, filename = _a.filename, content = _a.content, language = _a.language;
                file = "\"" + filename + "\" ";
                if (!id) return [3, 3];
                logger_1.logger.info("Saving \"" + filename + "\"");
                return [4, gists_1.updateGist(id, filename, content)];
            case 2:
                _b.sent();
                utils_1.notify.info("Saved \"" + filename + "\"");
                insights_1.insights.track('save', { language: language });
                return [3, 4];
            case 3:
                logger_1.logger.info("\"" + doc.fileName + "\" Not a Gist");
                _b.label = 4;
            case 4: return [3, 6];
            case 5:
                err_2 = _b.sent();
                error = err_2;
                logger_1.logger.error("updateCodeBlock > " + (error && error.message));
                insights_1.insights.exception('updateCodeBlock', { messsage: error.message });
                if (error && error.message === 'Not Found') {
                    utils_1.notify.error("Could Not Save " + file, "Reason: " + error.message);
                }
                return [3, 6];
            case 6: return [2];
        }
    });
}); };
exports.updateCodeBlock = updateCodeBlock;
var updateGistAccessKey = function () {
    var _a = profiles_1.profiles.get(), key = _a.key, url = _a.url;
    gists_1.configure({ key: key, url: url });
    insights_1.insights.track('updateGistAccessKey', { url: url });
};
exports.updateGistAccessKey = updateGistAccessKey;
var createCodeBlock = function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, gistName, editor, selection, content, details, filename, description, isPublic, gist, err_3, context_1, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                gistName = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                editor = vscode_1.window.activeTextEditor;
                if (!editor) {
                    throw new Error('Open a file before creating');
                }
                selection = editor.selection;
                content = editor.document.getText(selection.isEmpty ? undefined : selection);
                details = utils_1.extractTextDocumentDetails(editor.document);
                filename = (details && details.filename) || 'untitled.txt';
                return [4, utils_1.prompt('Enter description')];
            case 2:
                description = _b.sent();
                return [4, utils_1.prompt('Public? Y = Yes, N = No', 'Y')];
            case 3:
                isPublic = ((_b.sent()) || 'Y')
                    .slice(0, 1)
                    .toLowerCase() === 'y';
                gistName = description || filename;
                return [4, gists_1.createGist((_a = {}, _a[filename] = { content: content }, _a), description, isPublic)];
            case 4:
                gist = _b.sent();
                return [4, _openCodeBlock(gist.id)];
            case 5:
                _b.sent();
                return [3, 7];
            case 6:
                err_3 = _b.sent();
                context_1 = gistName ? " " + gistName : '';
                error = err_3;
                logger_1.logger.error("createCodeBlock > " + (error && error.message));
                insights_1.insights.exception('createCodeBlock', { messsage: error.message });
                utils_1.notify.error("Could Not Create" + context_1, "Reason: " + error.message);
                return [3, 7];
            case 7: return [2];
        }
    });
}); };
exports.createCodeBlock = createCodeBlock;
//# sourceMappingURL=gists.commands.js.map