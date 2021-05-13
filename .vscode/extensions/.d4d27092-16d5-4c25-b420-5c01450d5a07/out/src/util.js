"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
/**
 * Check if the line is empty string or only whitespace(s) or not
 */
function isEmptyOrWhitespace(str) {
    const spaces = str.match(/\s/g) || '';
    return str === '' || spaces.length === str.length;
}
exports.isEmptyOrWhitespace = isEmptyOrWhitespace;
/**
 * Check if the line is a comment line or not
 */
function isCommentLine(str) {
    return !!str.match(/^\s*#/);
}
exports.isCommentLine = isCommentLine;
/**
 * Check if the line contains a key or not
 */
function isKey(str) {
    return !!str.match(constants_1.FIND_KEY_REGEX);
}
exports.isKey = isKey;
/**
 * Find the closet key
 */
function findLineOfClosestKey(selectedLineText, lines) {
    return lines.filter(line => !isCommentLine(line) && isKey(line)).pop();
}
exports.findLineOfClosestKey = findLineOfClosestKey;
/**
 * Get the spaces of the string, if it doesn't contain
 * spaces, it will return an array with empty string.
 */
function textIndentations(str) {
    return (str.match(/^\s*/) || [''])[0];
}
exports.textIndentations = textIndentations;
/**
 * Function to filter unnecessary lines, including empty line,
 * line with only whitespace(s) and comment line
 */
function isUnnecessaryLine(line) {
    return !isEmptyOrWhitespace(line) && !isCommentLine(line);
}
exports.isUnnecessaryLine = isUnnecessaryLine;
//# sourceMappingURL=util.js.map