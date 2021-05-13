/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const tasks_1 = require("./tasks");
var Is;
(function (Is) {
    const toString = Object.prototype.toString;
    function boolean(value) {
        return value === true || value === false;
    }
    Is.boolean = boolean;
    function string(value) {
        return toString.call(value) === "[object String]";
    }
    Is.string = string;
})(Is || (Is = {}));
var ValidateItem;
(function (ValidateItem) {
    function is(item) {
        let candidate = item;
        return candidate && Is.string(candidate.language);
    }
    ValidateItem.is = is;
})(ValidateItem || (ValidateItem = {}));
var DirectoryItem;
(function (DirectoryItem) {
    function is(item) {
        let candidate = item;
        return (candidate &&
            Is.string(candidate.directory) &&
            (Is.boolean(candidate.changeProcessCWD) ||
                candidate.changeProcessCWD === void 0));
    }
    DirectoryItem.is = is;
})(DirectoryItem || (DirectoryItem = {}));
var Status;
(function (Status) {
    Status[Status["ok"] = 1] = "ok";
    Status[Status["warn"] = 2] = "warn";
    Status[Status["error"] = 3] = "error";
})(Status || (Status = {}));
var StatusNotification;
(function (StatusNotification) {
    StatusNotification.type = new vscode_languageclient_1.NotificationType("healthier/status");
})(StatusNotification || (StatusNotification = {}));
var OpenESLintDocRequest;
(function (OpenESLintDocRequest) {
    OpenESLintDocRequest.type = new vscode_languageclient_1.RequestType("healthier/openDoc");
})(OpenESLintDocRequest || (OpenESLintDocRequest = {}));
const exitCalled = new vscode_languageclient_1.NotificationType("healthier/exitCalled");
function pickFolder(folders, placeHolder) {
    if (folders.length === 1) {
        return Promise.resolve(folders[0]);
    }
    return vscode_1.window.showQuickPick(folders.map(folder => {
        return {
            label: folder.name,
            description: folder.uri.fsPath,
            folder: folder
        };
    }), { placeHolder: placeHolder }).then(selected => {
        if (!selected) {
            return undefined;
        }
        return selected.folder;
    });
}
function enable() {
    let folders = vscode_1.workspace.workspaceFolders;
    if (!folders) {
        vscode_1.window.showWarningMessage("Healthier can only be enabled if VS Code is opened on a workspace folder.");
        return;
    }
    let disabledFolders = folders.filter(folder => !vscode_1.workspace.getConfiguration("healthier", folder.uri).get("enable", true));
    if (disabledFolders.length === 0) {
        if (folders.length === 1) {
            vscode_1.window.showInformationMessage("Healthier is already enabled in the workspace.");
        }
        else {
            vscode_1.window.showInformationMessage("Healthier is already enabled on all workspace folders.");
        }
        return;
    }
    pickFolder(disabledFolders, "Select a workspace folder to enable Healthier for").then(folder => {
        if (!folder) {
            return;
        }
        vscode_1.workspace.getConfiguration("healthier", folder.uri).update("enable", true);
    });
}
function disable() {
    let folders = vscode_1.workspace.workspaceFolders;
    if (!folders) {
        vscode_1.window.showErrorMessage("Healthier can only be disabled if VS Code is opened on a workspace folder.");
        return;
    }
    let enabledFolders = folders.filter(folder => vscode_1.workspace.getConfiguration("healthier", folder.uri).get("enable", true));
    if (enabledFolders.length === 0) {
        if (folders.length === 1) {
            vscode_1.window.showInformationMessage("Healthier is already disabled in the workspace.");
        }
        else {
            vscode_1.window.showInformationMessage("Healthier is already disabled on all workspace folders.");
        }
        return;
    }
    pickFolder(enabledFolders, "Select a workspace folder to disable Healthier for").then(folder => {
        if (!folder) {
            return;
        }
        vscode_1.workspace.getConfiguration("healthier", folder.uri).update("enable", false);
    });
}
let dummyCommands;
let defaultLanguages = ["javascript", "javascriptreact"];
function shouldBeValidated(textDocument) {
    let config = vscode_1.workspace.getConfiguration("healthier", textDocument.uri);
    if (!config.get("enable", true)) {
        return false;
    }
    let validate = config.get("validate", defaultLanguages);
    for (let item of validate) {
        if (Is.string(item) && item === textDocument.languageId) {
            return true;
        }
        else if (ValidateItem.is(item) &&
            item.language === textDocument.languageId) {
            return true;
        }
    }
    return false;
}
let taskProvider;
function activate(context) {
    let activated;
    let openListener;
    let configurationListener;
    function didOpenTextDocument(textDocument) {
        if (activated) {
            return;
        }
        if (shouldBeValidated(textDocument)) {
            openListener.dispose();
            configurationListener.dispose();
            activated = true;
            realActivate(context);
        }
    }
    function configurationChanged() {
        if (activated) {
            return;
        }
        for (let textDocument of vscode_1.workspace.textDocuments) {
            if (shouldBeValidated(textDocument)) {
                openListener.dispose();
                configurationListener.dispose();
                activated = true;
                realActivate(context);
                return;
            }
        }
    }
    openListener = vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
    configurationListener = vscode_1.workspace.onDidChangeConfiguration(configurationChanged);
    let notValidating = () => vscode_1.window.showInformationMessage("Healthier is not validating any files yet.");
    dummyCommands = [
        vscode_1.commands.registerCommand("healthier.showOutputChannel", notValidating)
    ];
    context.subscriptions.push(vscode_1.commands.registerCommand("healthier.enable", enable), vscode_1.commands.registerCommand("healthier.disable", disable));
    taskProvider = new tasks_1.TaskProvider();
    taskProvider.start();
    configurationChanged();
}
exports.activate = activate;
function realActivate(context) {
    let statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 0);
    let healthierStatus = Status.ok;
    let serverRunning = false;
    statusBarItem.text = "Healthier";
    statusBarItem.command = "healthier.showOutputChannel";
    function showStatusBarItem(show) {
        if (show) {
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }
    function updateStatus(status) {
        healthierStatus = status;
        switch (status) {
            case Status.ok:
                statusBarItem.text = "Healthier";
                break;
            case Status.warn:
                statusBarItem.text = "$(alert) Healthier";
                break;
            case Status.error:
                statusBarItem.text = "$(issue-opened) Healthier";
                break;
            default:
                statusBarItem.text = "Healthier";
        }
        updateStatusBarVisibility();
    }
    function updateStatusBarVisibility() {
        showStatusBarItem(serverRunning && healthierStatus !== Status.ok);
    }
    // We need to go one level up since an extension compile the js code into
    // the output folder.
    // serverModule
    let serverModule = context.asAbsolutePath(path.join("server", "out", "healthierServer.js"));
    let runtime = vscode_1.workspace.getConfiguration("healthier").get("runtime", null);
    let serverOptions = {
        run: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            runtime,
            options: { cwd: process.cwd() }
        },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            runtime,
            options: { execArgv: ["--nolazy", "--inspect=6010"], cwd: process.cwd() }
        }
    };
    let defaultErrorHandler;
    let serverCalledProcessExit = false;
    let packageJsonFilter = {
        scheme: "file",
        pattern: "**/package.json"
    };
    let configFileFilter = {
        scheme: "file",
        pattern: "**/.eslintr{c.js,c.yaml,c.yml,c,c.json}"
    };
    let syncedDocuments = new Map();
    vscode_1.workspace.onDidChangeConfiguration(() => {
        for (let textDocument of syncedDocuments.values()) {
            if (!shouldBeValidated(textDocument)) {
                syncedDocuments.delete(textDocument.uri.toString());
                client.sendNotification(vscode_languageclient_1.DidCloseTextDocumentNotification.type, client.code2ProtocolConverter.asCloseTextDocumentParams(textDocument));
            }
        }
        for (let textDocument of vscode_1.workspace.textDocuments) {
            if (!syncedDocuments.has(textDocument.uri.toString()) &&
                shouldBeValidated(textDocument)) {
                client.sendNotification(vscode_languageclient_1.DidOpenTextDocumentNotification.type, client.code2ProtocolConverter.asOpenTextDocumentParams(textDocument));
                syncedDocuments.set(textDocument.uri.toString(), textDocument);
            }
        }
    });
    let clientOptions = {
        documentSelector: [{ scheme: "file" }, { scheme: "untitled" }],
        diagnosticCollectionName: "healthier",
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
        synchronize: {
            // configurationSection: 'healthier',
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher("**/.eslintr{c.js,c.yaml,c.yml,c,c.json}"),
                vscode_1.workspace.createFileSystemWatcher("**/.eslintignore"),
                vscode_1.workspace.createFileSystemWatcher("**/.prettierignore"),
                vscode_1.workspace.createFileSystemWatcher("**/package.json")
            ]
        },
        initializationFailedHandler: error => {
            client.error("Server initialization failed.", error);
            client.outputChannel.show(true);
            return false;
        },
        errorHandler: {
            error: (error, message, count) => {
                return defaultErrorHandler.error(error, message, count);
            },
            closed: () => {
                if (serverCalledProcessExit) {
                    return vscode_languageclient_1.CloseAction.DoNotRestart;
                }
                return defaultErrorHandler.closed();
            }
        },
        middleware: {
            didOpen: (document, next) => {
                if (vscode_1.languages.match(packageJsonFilter, document) ||
                    vscode_1.languages.match(configFileFilter, document) ||
                    shouldBeValidated(document)) {
                    next(document);
                    syncedDocuments.set(document.uri.toString(), document);
                    return;
                }
            },
            didChange: (event, next) => {
                if (syncedDocuments.has(event.document.uri.toString())) {
                    next(event);
                }
            },
            willSave: (event, next) => {
                if (syncedDocuments.has(event.document.uri.toString())) {
                    next(event);
                }
            },
            willSaveWaitUntil: (event, next) => {
                if (syncedDocuments.has(event.document.uri.toString())) {
                    return next(event);
                }
                else {
                    return Promise.resolve([]);
                }
            },
            didSave: (document, next) => {
                if (syncedDocuments.has(document.uri.toString())) {
                    next(document);
                }
            },
            didClose: (document, next) => {
                let uri = document.uri.toString();
                if (syncedDocuments.has(uri)) {
                    syncedDocuments.delete(uri);
                    next(document);
                }
            },
            provideCodeActions: (document, range, context, token, next) => {
                if (!syncedDocuments.has(document.uri.toString()) ||
                    !context.diagnostics ||
                    context.diagnostics.length === 0) {
                    return [];
                }
                let eslintDiagnostics = [];
                for (let diagnostic of context.diagnostics) {
                    if (diagnostic.source === "healthier") {
                        eslintDiagnostics.push(diagnostic);
                    }
                }
                if (eslintDiagnostics.length === 0) {
                    return [];
                }
                let newContext = Object.assign({}, context, {
                    diagnostics: eslintDiagnostics
                });
                return next(document, range, newContext, token);
            },
            workspace: {
                configuration: (params, _token, _next) => {
                    if (!params.items) {
                        return null;
                    }
                    let result = [];
                    for (let item of params.items) {
                        if (item.section || !item.scopeUri) {
                            result.push(null);
                            continue;
                        }
                        let resource = client.protocol2CodeConverter.asUri(item.scopeUri);
                        let config = vscode_1.workspace.getConfiguration("healthier", resource);
                        let settings = {
                            validate: false,
                            options: config.get("options", {}),
                            run: config.get("run", "onType"),
                            workingDirectory: undefined,
                            workspaceFolder: undefined,
                            library: undefined
                        };
                        let document = syncedDocuments.get(item.scopeUri);
                        if (!document) {
                            result.push(settings);
                            continue;
                        }
                        if (config.get("enabled", true)) {
                            let validateItems = config.get("validate", ["javascript", "javascriptreact"]);
                            for (let item of validateItems) {
                                if (Is.string(item) && item === document.languageId) {
                                    settings.validate = true;
                                    break;
                                }
                                else if (ValidateItem.is(item) &&
                                    item.language === document.languageId) {
                                    settings.validate = true;
                                    break;
                                }
                            }
                        }
                        let workspaceFolder = vscode_1.workspace.getWorkspaceFolder(resource);
                        if (workspaceFolder) {
                            settings.workspaceFolder = {
                                name: workspaceFolder.name,
                                uri: client.code2ProtocolConverter.asUri(workspaceFolder.uri)
                            };
                        }
                        result.push(settings);
                    }
                    return result;
                }
            }
        }
    };
    let client = new vscode_languageclient_1.LanguageClient("Healthier", serverOptions, clientOptions);
    client.registerProposedFeatures();
    defaultErrorHandler = client.createDefaultErrorHandler();
    const running = "Healthier server is running.";
    const stopped = "Healthier server stopped.";
    client.onDidChangeState(event => {
        if (event.newState === vscode_languageclient_1.State.Running) {
            client.info(running);
            statusBarItem.tooltip = running;
            serverRunning = true;
        }
        else {
            client.info(stopped);
            statusBarItem.tooltip = stopped;
            serverRunning = false;
        }
        updateStatusBarVisibility();
    });
    client.onReady().then(() => {
        client.onNotification(StatusNotification.type, params => {
            updateStatus(params.state);
        });
        client.onNotification(exitCalled, params => {
            serverCalledProcessExit = true;
            client.error(`Server process exited with code ${params[0]}. This usually indicates a misconfigured Healthier setup.`, params[1]);
            vscode_1.window.showErrorMessage(`Healthier server shut down itself. See 'Healthier' output channel for details.`);
        });
        client.onRequest(OpenESLintDocRequest.type, params => {
            vscode_1.commands.executeCommand("vscode.open", vscode_1.Uri.parse(params.url));
            return {};
        });
    });
    if (dummyCommands) {
        dummyCommands.forEach(command => command.dispose());
        dummyCommands = undefined;
    }
    updateStatusBarVisibility();
    context.subscriptions.push(client.start(), vscode_1.commands.registerCommand("healthier.showOutputChannel", () => {
        client.outputChannel.show();
    }), statusBarItem);
}
exports.realActivate = realActivate;
function deactivate() {
    if (dummyCommands) {
        dummyCommands.forEach(command => command.dispose());
    }
    if (taskProvider) {
        taskProvider.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map