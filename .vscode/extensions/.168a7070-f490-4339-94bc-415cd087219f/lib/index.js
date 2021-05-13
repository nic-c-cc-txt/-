"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const Extension_1 = require("./Extension");
/**
 * The extension.
 */
let extension = new Extension_1.Extension();
/**
 * Activates the extension.
 *
 * @param context
 * The extension-context.
 */
exports.activate = (context) => extension.Activate(context);
/**
 * Deactivates the extension.
 */
exports.deactivate = () => extension.Dispose();
//# sourceMappingURL=index.js.map