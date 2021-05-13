"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const vscode = require("vscode");
const yaml_parser_1 = require("../../src/yaml-parser");
suite('YAML Parser Tests', function () {
    test('Parse YAML function', function () {
        vscode.workspace
            .openTextDocument(path.join(__dirname, './test.yml'))
            .then(doc => vscode.window.showTextDocument(doc).then(editor => {
            editor.edit(te => {
                te.insert(doc.positionAt(Infinity), ' ');
            });
            return editor;
        }))
            .then(editor => {
            assert.equal(false, yaml_parser_1.parseYaml(editor));
        });
    });
});
//# sourceMappingURL=yaml-parser.test.js.map