"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Util = require("../../src/util");
const mockData_1 = require("./mockData");
suite('Util Tests', function () {
    test('isEmptyOrWhitespace function', function () {
        assert.equal(Util.isEmptyOrWhitespace(mockData_1.emptyLine), true);
        assert.equal(Util.isEmptyOrWhitespace(mockData_1.lineWithOnlyWhitespaces), true);
        assert.equal(Util.isEmptyOrWhitespace(mockData_1.keyLine), false);
        assert.equal(Util.isEmptyOrWhitespace(mockData_1.valueLine), false);
        assert.equal(Util.isEmptyOrWhitespace(mockData_1.commentLine), false);
        assert.equal(Util.isEmptyOrWhitespace(mockData_1.commentLineStartWithSpaces), false);
    });
    test('isKey function', function () {
        assert.equal(Util.isKey(mockData_1.keyLine), true);
        assert.equal(Util.isKey(mockData_1.valueLine), false);
        assert.equal(Util.isKey(mockData_1.emptyLine), false);
        assert.equal(Util.isKey(mockData_1.commentLine), false);
        assert.equal(Util.isKey(mockData_1.lineWithOnlyWhitespaces), false);
        assert.equal(Util.isKey(mockData_1.commentLineStartWithSpaces), false);
    });
    test('isCommentLine function', function () {
        assert.equal(Util.isCommentLine(mockData_1.commentLine), true);
        assert.equal(Util.isCommentLine(mockData_1.commentLineStartWithSpaces), true);
        assert.equal(Util.isCommentLine(mockData_1.keyLine), false);
        assert.equal(Util.isCommentLine(mockData_1.valueLine), false);
        assert.equal(Util.isCommentLine(mockData_1.emptyLine), false);
        assert.equal(Util.isCommentLine(mockData_1.lineWithOnlyWhitespaces), false);
    });
    test('textIndentations function', function () {
        assert.equal(Util.textIndentations(mockData_1.commentLine).length, 0);
        assert.equal(Util.textIndentations(mockData_1.keyLine).length, 2);
        assert.equal(Util.textIndentations(mockData_1.commentLineStartWithSpaces).length, 4);
    });
    test('isUnnecessaryLine function', function () {
        assert.equal(Util.isUnnecessaryLine(mockData_1.commentLine), false);
        assert.equal(Util.isUnnecessaryLine(mockData_1.commentLineStartWithSpaces), false);
        assert.equal(Util.isUnnecessaryLine(mockData_1.emptyLine), false);
        assert.equal(Util.isUnnecessaryLine(mockData_1.lineWithOnlyWhitespaces), false);
        assert.equal(Util.isUnnecessaryLine(mockData_1.keyLine), true);
        assert.equal(Util.isUnnecessaryLine(mockData_1.valueLine), true);
    });
    test('findLineOfClosestKey function', function () {
        assert.equal(Util.findLineOfClosestKey(mockData_1.selectedForClosest, mockData_1.mockForClosest.split('\n')), mockData_1.expectedLineForClosest);
    });
});
//# sourceMappingURL=util.test.js.map