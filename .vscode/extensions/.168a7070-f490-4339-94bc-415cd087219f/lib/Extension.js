"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extension = void 0;
const typescript_eslint_plugin_1 = require("@manuth/typescript-eslint-plugin");
const vscode_1 = require("vscode");
/**
 * Represents the extension.
 */
class Extension {
    /**
     * Initializes a new instance of the `Extension`-class.
     */
    constructor() {
        /**
         * The context of the extension.
         */
        this.context = null;
    }
    /**
     * Gets context of the of the extension.
     */
    get Context() {
        return this.context;
    }
    /**
     * Activates the extension.
     *
     * @param context
     * A collection of utilities private to an extension.
     */
    Activate(context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.context = context;
            let typeScriptExtension = vscode_1.extensions.getExtension(Extension.typeScriptExtensionId);
            if (typeScriptExtension) {
                yield typeScriptExtension.activate();
                if ((_a = typeScriptExtension.exports) === null || _a === void 0 ? void 0 : _a.getAPI) {
                    let api = typeScriptExtension.exports.getAPI(0);
                    vscode_1.workspace.onDidChangeConfiguration((event) => {
                        if (event.affectsConfiguration(Extension.configSection)) {
                            this.UpdateConfig(api);
                        }
                    });
                    this.UpdateConfig(api);
                }
            }
        });
    }
    /**
     * Disposes the extension.
     */
    Dispose() { }
    /**
     * Updates the configuration of the plugin.
     *
     * @param api
     * The API of the typescript-extension.
     */
    UpdateConfig(api) {
        let workspaceConfig = vscode_1.workspace.getConfiguration();
        let config = workspaceConfig.get(Extension.configSection);
        if (typeof config === "object") {
            let extensionConfig = vscode_1.workspace.getConfiguration(Extension.configSection);
            let result = {};
            for (let key in config) {
                let inspectedConfig = extensionConfig.inspect(key);
                if ((typeof inspectedConfig.globalValue !== "undefined") ||
                    (typeof inspectedConfig.workspaceValue !== "undefined") ||
                    (typeof inspectedConfig.workspaceFolderValue !== "undefined")) {
                    result[key] = extensionConfig.get(key);
                }
            }
            api.configurePlugin(Extension.pluginId, result);
        }
    }
}
exports.Extension = Extension;
/**
 * The extension-id of the `typescript` extension.
 */
Extension.typeScriptExtensionId = "vscode.typescript-language-features";
/**
 * The id of the plugin to add.
 */
Extension.pluginId = typescript_eslint_plugin_1.Constants.Package.Name;
/**
 * The name of the configuration-section.
 */
Extension.configSection = "eslint-service";
//# sourceMappingURL=Extension.js.map