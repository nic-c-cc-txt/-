"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
class CommandHelpers {
    getAllCommands() {
        let commands = [];
        commands.push({ label: "HTML Encode", commandName: "htmlEncode" });
        commands.push({ label: "HTML Decode", commandName: "htmlDecode" });
        commands.push({ label: "URL Encode", commandName: "urlEncode" });
        commands.push({ label: "URL Decode", commandName: "urlDecode" });
        commands.push({ label: "To Title Case", commandName: "toTitleCase" });
        commands.push({ label: "To Lower Case", commandName: "toLowerCase" });
        commands.push({ label: "To Upper Case", commandName: "toUpperCase" });
        commands.push({ label: "Capitalize First Letter", commandName: "capitalizeFirstLetter" });
        commands.push({ label: "Reverse", commandName: "reverse" });
        commands.push({ label: "Remove Accents/Diacritics", commandName: "removeAccent" });
        commands.push({ label: "MD5", commandName: "toMd5" });
        commands.push({ label: "SHA-1", commandName: "toSha1" });
        commands.push({ label: "SHA-256", commandName: "toSha256" });
        commands.push({ label: "SHA-384", commandName: "toSha384" });
        commands.push({ label: "SHA-512", commandName: "toSha512" });
        commands.push({ label: "Sort Ascending", commandName: "sortAscending" });
        commands.push({ label: "Sort Descending", commandName: "sortDescending" });
        commands.push({ label: "Remove Empty Lines", commandName: "removeEmptyLines" });
        commands.push({ label: "Remove Horizontal White Space", commandName: "removeHorizontalWhiteSpace" });
        commands.push({ label: "Remove Duplicate Lines", commandName: "removeDuplicateLines" });
        return commands;
    }
    getCommandResult(selection, cmd) {
        return Utils_1.Utils[cmd](selection);
    }
}
exports.CommandHelpers = CommandHelpers;
//# sourceMappingURL=CommandHelpers.js.map