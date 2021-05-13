import { ExtensionContext } from "vscode";
import { IApiV0 } from "./IApiV0";
/**
 * Represents the extension.
 */
export declare class Extension {
    /**
     * The extension-id of the `typescript` extension.
     */
    private static typeScriptExtensionId;
    /**
     * The id of the plugin to add.
     */
    private static pluginId;
    /**
     * The name of the configuration-section.
     */
    private static configSection;
    /**
     * The context of the extension.
     */
    private context;
    /**
     * Initializes a new instance of the `Extension`-class.
     */
    constructor();
    /**
     * Gets context of the of the extension.
     */
    get Context(): ExtensionContext;
    /**
     * Activates the extension.
     *
     * @param context
     * A collection of utilities private to an extension.
     */
    Activate(context: ExtensionContext): Promise<void>;
    /**
     * Disposes the extension.
     */
    Dispose(): void;
    /**
     * Updates the configuration of the plugin.
     *
     * @param api
     * The API of the typescript-extension.
     */
    protected UpdateConfig(api: IApiV0): void;
}
