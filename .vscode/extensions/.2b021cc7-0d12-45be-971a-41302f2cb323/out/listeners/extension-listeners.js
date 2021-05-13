"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Listeners;
(function (Listeners) {
    Listeners[Listeners["OnDidChangeConfiguration"] = 0] = "OnDidChangeConfiguration";
    Listeners[Listeners["OnDidChangeTextDocument"] = 1] = "OnDidChangeTextDocument";
    Listeners[Listeners["OnDidChangeWorkspaceFolders"] = 2] = "OnDidChangeWorkspaceFolders";
    Listeners[Listeners["OnDidCloseTextDocument"] = 3] = "OnDidCloseTextDocument";
    Listeners[Listeners["OnDidOpenTextDocument"] = 4] = "OnDidOpenTextDocument";
    Listeners[Listeners["OnDidSaveTextDocument"] = 5] = "OnDidSaveTextDocument";
    Listeners[Listeners["OnWillSaveTextDocument"] = 6] = "OnWillSaveTextDocument";
})(Listeners || (Listeners = {}));
exports.Listeners = Listeners;
var getListener = function (key) {
    var rawValue = Listeners[key];
    return rawValue.slice(0, 1).toLowerCase() + rawValue.slice(1);
};
exports.getListener = getListener;
//# sourceMappingURL=extension-listeners.js.map