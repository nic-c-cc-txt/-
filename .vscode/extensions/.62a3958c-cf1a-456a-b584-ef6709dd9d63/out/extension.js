"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const play = require("./main/play");
const config = require("./main/config");
let actionItem;
let linkItem;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Playground" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableCreatePlayCommand = vscode.commands.registerCommand('playground.create', () => {
        // The code you place here will be executed every time your command is executed
        //create a play
        play.createUpdatePlay(true);
    });
    let disposableUpdatePlayCommand = vscode.commands.registerCommand('playground.update', () => {
        // The code you place here will be executed every time your command is executed
        //create a play
        play.createUpdatePlay(false);
    });
    let disposableResetCommand = vscode.commands.registerCommand('playground.connect', () => {
        // The code you place here will be executed every time your command is executed
        //create a play
        config.connect(true).then(function (result) {
            if (result.success) {
                updateStatusBarItem();
            }
        });
    });
    let disposableInitCommand = vscode.commands.registerCommand('playground.init', () => {
        // The code you place here will be executed every time your command is executed
        //init playground setup
        config.init().then(function () {
            updateStatusBarItem();
        });
    });
    let disposableAddIgnoreFileCommand = vscode.commands.registerCommand('playground.ignorefile', () => {
        // The code you place here will be executed every time your command is executed
        //show ignore files
        config.showIgnoreOptions();
    });
    let disposableOpenCommand = vscode.commands.registerCommand('playground.open', () => {
        // The code you place here will be executed every time your command is executed
        //create a play
        play.openLink();
    });
    context.subscriptions.push(disposableCreatePlayCommand);
    context.subscriptions.push(disposableUpdatePlayCommand);
    context.subscriptions.push(disposableResetCommand);
    context.subscriptions.push(disposableOpenCommand);
    // create a connect status bar item that can rendered appropriately
    linkItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
    linkItem.tooltip = 'Open this project on Playground';
    linkItem.command = 'playground.open';
    linkItem.text = '$(link-external)';
    context.subscriptions.push(linkItem);
    // create a new push status bar item to upload data
    actionItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    context.subscriptions.push(actionItem);
    // register some listener that make sure the status bar 
    // item always up-to-datei
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
    // update status bar item once at start
    updateStatusBarItem();
    function updateStatusBarItem() {
        config.checkSetup().then(function (result) {
            if (result.success && result.result.localSetup && result.result.directorySetup) {
                actionItem.tooltip = 'Push your changes in this project to Playground';
                actionItem.command = 'playground.create';
                actionItem.text = 'Playground: Push Changes';
            }
            else {
                actionItem.tooltip = 'Start setup for Playground';
                actionItem.command = 'playground.init';
                actionItem.text = 'Playground: Init';
            }
            actionItem.show();
        });
        let playResult = config.readPlayJson();
        if (playResult.success && playResult.play.url) {
            linkItem.show();
        }
        else {
            linkItem.hide();
        }
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map