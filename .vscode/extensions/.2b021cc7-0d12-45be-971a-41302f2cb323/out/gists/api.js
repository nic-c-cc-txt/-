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
var constants_1 = require("../constants");
var gists_service_1 = require("./gists-service");
var prepareError = function (err) {
    var httpError;
    try {
        httpError = new Error((JSON.parse(err && err.message) || { message: 'unkown' }).message);
    }
    catch (exc) {
    }
    return httpError || err;
};
var formatGist = function (gist) { return ({
    createdAt: new Intl.DateTimeFormat(vscode_1.env.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(gist.created_at)),
    description: gist.description,
    fileCount: Object.keys(gist.files).length,
    files: gist.files,
    id: gist.id,
    name: gist.description || Object.keys(gist.files)[0],
    public: gist.public,
    updatedAt: new Intl.DateTimeFormat(vscode_1.env.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(gist.updated_at)),
    url: gist.html_url
}); };
var formatGists = function (gistList) {
    return gistList.map(formatGist);
};
var getGist = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var results, err_1, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, gists_service_1.gists.get({ gist_id: id })];
            case 1:
                results = _a.sent();
                return [2, formatGist(results.data)];
            case 2:
                err_1 = _a.sent();
                error = prepareError(err_1);
                throw error;
            case 3: return [2];
        }
    });
}); };
exports.getGist = getGist;
var getGists = function (starred) {
    if (starred === void 0) { starred = false; }
    return __awaiter(_this, void 0, void 0, function () {
        var results, err_2, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, gists_service_1.gists[starred ? 'listStarred' : 'list']({
                            per_page: constants_1.GISTS_PER_PAGE
                        })];
                case 1:
                    results = _a.sent();
                    return [2, formatGists(results.data)];
                case 2:
                    err_2 = _a.sent();
                    error = prepareError(err_2);
                    throw error;
                case 3: return [2];
            }
        });
    });
};
exports.getGists = getGists;
var updateGist = function (id, filename, content) { return __awaiter(_this, void 0, void 0, function () {
    var _a, results, err_3, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4, gists_service_1.gists.update({
                        files: (_a = {}, _a[filename] = { content: content }, _a),
                        gist_id: id
                    })];
            case 1:
                results = _b.sent();
                return [2, formatGist(results.data)];
            case 2:
                err_3 = _b.sent();
                error = prepareError(err_3);
                throw error;
            case 3: return [2];
        }
    });
}); };
exports.updateGist = updateGist;
var configure = function (options) {
    var key = options.key || '';
    var url = options.url || constants_1.GISTS_BASE_URL;
    gists_service_1.gists.configure({ key: key, url: url });
};
exports.configure = configure;
var createGist = function (files, description, isPublic) {
    if (isPublic === void 0) { isPublic = true; }
    return __awaiter(_this, void 0, void 0, function () {
        var results, err_4, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, gists_service_1.gists.create({
                            description: description,
                            files: files,
                            public: isPublic
                        })];
                case 1:
                    results = _a.sent();
                    return [2, formatGist(results.data)];
                case 2:
                    err_4 = _a.sent();
                    error = prepareError(err_4);
                    throw error;
                case 3: return [2];
            }
        });
    });
};
exports.createGist = createGist;
var deleteGist = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var err_5, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, gists_service_1.gists.delete({ gist_id: id })];
            case 1:
                _a.sent();
                return [3, 3];
            case 2:
                err_5 = _a.sent();
                error = prepareError(err_5);
                throw error;
            case 3: return [2];
        }
    });
}); };
exports.deleteGist = deleteGist;
var deleteFile = function (id, filename) { return __awaiter(_this, void 0, void 0, function () {
    var _a, err_6, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4, gists_service_1.gists.update({
                        files: (_a = {}, _a[filename] = null, _a),
                        gist_id: id
                    })];
            case 1:
                _b.sent();
                return [3, 3];
            case 2:
                err_6 = _b.sent();
                error = prepareError(err_6);
                throw error;
            case 3: return [2];
        }
    });
}); };
exports.deleteFile = deleteFile;
//# sourceMappingURL=api.js.map