"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var tmp = require("tmp");
var constants_1 = require("../constants");
var dirSync = function (token) {
    var prefix = [constants_1.TMP_DIRECTORY_PREFIX, token].join('_') + "_";
    var directory = tmp.dirSync({ prefix: prefix });
    return directory.name;
};
var fileSync = function (token, filename, content) {
    var directory = dirSync(token);
    var filePath = path.join(directory, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
};
exports.fileSync = fileSync;
var filesSync = function (token, files) {
    var filePaths = [];
    for (var filename in files) {
        if (files.hasOwnProperty(filename)) {
            var content = files[filename].content;
            filePaths.push(fileSync(token, filename, content));
        }
    }
    return filePaths;
};
exports.filesSync = filesSync;
var extractTextDocumentDetails = function (doc, editor) {
    var sep = path.sep === '\\' ? '\\\\' : path.sep;
    var regexp = new RegExp(".*" + constants_1.TMP_DIRECTORY_PREFIX + "_([^_]*)_[^" + sep + "]*" + sep + "(.*)");
    var _a = doc.fileName.match(regexp) || ['', '', ''], fullPath = _a[0], id = _a[1], filename = _a[2];
    var content = doc.getText();
    var languageId = (editor ? editor.document : { languageId: 'unknown' }).languageId;
    return {
        content: content,
        filename: filename,
        id: id,
        language: languageId,
        path: path.dirname(fullPath)
    };
};
exports.extractTextDocumentDetails = extractTextDocumentDetails;
var getFileName = function (doc, fallback) {
    var filepath = doc.fileName;
    return path.basename(filepath) || fallback || 'unknown.txt';
};
exports.getFileName = getFileName;
//# sourceMappingURL=file.js.map