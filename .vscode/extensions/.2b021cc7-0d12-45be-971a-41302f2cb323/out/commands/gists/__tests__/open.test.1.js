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
var open_1 = require("../open");
jest.mock('fs');
jest.mock('path');
var getGistsMock = jest.fn(function () { return [
    {
        createdAt: new Date(),
        description: 'some markdown file',
        fileCount: 1,
        files: { 'file-one.md': { content: 'test' } },
        id: '123',
        name: 'gist one',
        public: true,
        updatedAt: new Date()
    },
    {
        createdAt: new Date(),
        description: 'some markdown file',
        fileCount: 1,
        files: { 'file-two.md': { content: 'test' } },
        id: '123',
        name: 'gist two',
        public: true,
        updatedAt: new Date()
    }
]; });
var getGistMock = jest.fn(function (id) { return ({
    createdAt: new Date(),
    description: 'some markdown file',
    fileCount: 1,
    files: { 'file-one.md': { content: 'test' } },
    id: id,
    name: 'test',
    public: true,
    updatedAt: new Date()
}); });
var utilsMock = jest.genMockFromModule('../../../utils');
var errorMock = jest.fn();
var showQuickPickSpy = jest.spyOn(vscode_1.window, 'showQuickPick');
var executeCommandSpy = jest.spyOn(vscode_1.commands, 'executeCommand');
describe('open', function () {
    var openFn;
    beforeEach(function () {
        var gists = { getGists: getGistsMock, getGist: getGistMock };
        var insights = { exception: jest.fn() };
        var logger = { error: errorMock, info: jest.fn() };
        openFn = open_1.open({ gists: gists, insights: insights, logger: logger }, utilsMock)[1];
        vscode_1.window.activeTextEditor = undefined;
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    test('what happens when errors occur', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(1);
                    showQuickPickSpy.mockRejectedValueOnce(false);
                    return [4, openFn()];
                case 1:
                    _a.sent();
                    expect(errorMock.mock.calls.length).toBe(1);
                    return [2];
            }
        });
    }); });
    test('it opens the quickpick pane', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstGist, secondGist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(3);
                    return [4, openFn()];
                case 1:
                    _a.sent();
                    expect(showQuickPickSpy.mock.calls.length).toBe(1);
                    firstGist = showQuickPickSpy.mock.calls[0][0][0];
                    secondGist = showQuickPickSpy.mock.calls[0][0][1];
                    expect(firstGist.label).toBe('2. gist one');
                    expect(secondGist.label).toBe('1. gist two');
                    return [2];
            }
        });
    }); });
    test('it opens a document', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(1);
                    showQuickPickSpy.mockResolvedValue({
                        block: {
                            id: '123'
                        },
                        label: 'foo'
                    });
                    return [4, openFn()];
                case 1:
                    _a.sent();
                    expect(executeCommandSpy).toHaveBeenCalledWith('workbench.action.keepEditor');
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=open.test.1.js.map