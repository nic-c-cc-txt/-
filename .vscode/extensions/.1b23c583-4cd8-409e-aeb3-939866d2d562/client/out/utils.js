"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function exists(file) {
    return new Promise((resolve, _reject) => {
        fs.exists(file, (value) => {
            resolve(value);
        });
    });
}
function findHealthier(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield exists(path.join(rootPath, 'node_modules', '.bin', 'healthier'))) {
            return path.join('.', 'node_modules', '.bin', 'healthier');
        }
        else {
            return null;
        }
    });
}
exports.findHealthier = findHealthier;
//# sourceMappingURL=utils.js.map