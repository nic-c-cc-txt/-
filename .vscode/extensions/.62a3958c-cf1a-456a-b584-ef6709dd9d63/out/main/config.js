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
const utils = require("./utils");
const request = require('request');
const playgroundFolder = utils.homeDirPlaygroundPath();
const configFile = utils.configFilePath();
const currPlaygroundFolder = utils.currentDirPlaygroundPath();
const playJsonFile = utils.playJsonPath();
const playgIgnoreSamplesRepoUrl = 'https://api.bitbucket.org/2.0/repositories/lkat-playg/playgignore-samples/src';
function init() {
    return new Promise(function (resolve, reject) {
        checkSetup().then(function (setupResult) {
            if (setupResult.success) {
                let result = setupResult.result;
                if (!result.localSetup) {
                    connect(true).then(function (connectResult) {
                        if (connectResult.success && !result.directorySetup) {
                            setupDirectoryFiles(connectResult.config).then(function () {
                                resolve();
                            }).catch(function (error) {
                                reject();
                            });
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    if (!result.directorySetup) {
                        connect(false).then(function (connectResult) {
                            if (connectResult.success) {
                                setupDirectoryFiles(connectResult.config).then(function () {
                                    resolve();
                                }).catch(function (error) {
                                    reject();
                                });
                            }
                        });
                    }
                    else {
                        resolve();
                    }
                }
            }
            else {
                utils.showError('Something went wrong!', undefined);
                reject();
            }
        }).catch(function (error) {
            reject();
        });
    });
}
exports.init = init;
function setupDirectoryFiles(config) {
    return new Promise(function (resolve, reject) {
        utils.showInputBox({ placeHolder: 'Enter your play title' }).then(function (title) {
            if (title) {
                getTypes(config).then(function (typesResult) {
                    utils.showPicker(typesResult.types, 'Choose type of play').then(function (selection) {
                        if (selection) {
                            let url = typesResult.links[selection] || typesResult.links['Basic'];
                            request.get({ url: url }, function optionalCallback(err, httpResponse, body) {
                                if (httpResponse.statusCode === 200) {
                                    //add ignore file
                                    utils.writeFile(utils.currentDirPlaygIgnorePath(), body);
                                    //add .playground folder
                                    utils.mkDir(currPlaygroundFolder);
                                    //add play.json with title
                                    utils.writeFile(utils.playJsonPath(), JSON.stringify({ title: title, type: selection }, null, 2));
                                    let ignoreFileMessage = 'A default .playgignore file is added to help you upload relevant part of your solution.';
                                    utils.showInformation(ignoreFileMessage, ['Check .playgignore']).then(function (item) {
                                        if (item === 'Check .playgignore') {
                                            utils.openFile(utils.currentDirPlaygIgnorePath());
                                        }
                                    });
                                    let message = 'Playground init successful';
                                    utils.showInformation(message, undefined);
                                    resolve();
                                }
                                else {
                                    console.error('Not able to retrieve sample file');
                                    utils.showError('Something went wrong!', undefined);
                                    reject();
                                }
                            });
                        }
                        else {
                            utils.showError('No play type selected!', undefined);
                        }
                    });
                }).catch(function (error) {
                    utils.showError('Something went wrong!', undefined);
                    reject();
                });
            }
            else {
                utils.showError('No title provided!', undefined);
                reject();
            }
        });
    });
}
exports.setupDirectoryFiles = setupDirectoryFiles;
function connect(reset) {
    return new Promise(function (resolve) {
        readConfiguration().then(function (result) {
            if (!reset && result.success) {
                resolve(result);
            }
            else {
                //setup by default origin
                let configOptions = {
                    origin: (utils.getExtConfiguration().origin).replace(/\/$/, "")
                };
                //create playgroundFolder if not present
                if (!utils.pathExists(playgroundFolder)) {
                    utils.mkDir(playgroundFolder);
                }
                utils.showInputBox({ placeHolder: 'Enter Domain URL', value: configOptions.origin }).then(function (domainUrl) {
                    if (domainUrl) {
                        if (utils.validateURL(domainUrl)) {
                            configOptions.origin = domainUrl;
                            //ask for nickname to store
                            utils.showInputBox({ placeHolder: 'Enter Nickname' }).then(function (nickname) {
                                if (nickname) {
                                    configOptions.nickname = nickname;
                                    utils.showInputBox({ placeHolder: 'Enter App Password' }).then(function (password) {
                                        if (password) {
                                            configOptions.token = utils.getBase64(nickname + ':' + password);
                                            //write playground configuration
                                            utils.writeFile(configFile, JSON.stringify(configOptions, null, 2));
                                            utils.showInformation('Configuration Saved!', ['Close']);
                                            resolve({ success: true, config: configOptions });
                                        }
                                        else {
                                            //fail if password is not provided
                                            utils.showError('No password provided!', undefined);
                                            resolve({ success: false });
                                        }
                                    });
                                }
                                else {
                                    //fail if nickname is not provided
                                    utils.showError('No nickname provided!', undefined);
                                    resolve({ success: false });
                                }
                            });
                        }
                        else {
                            utils.showError('Domain url should be in proper Playground format. It should start with https:// & end with playg.app domain', undefined);
                            resolve({ success: false });
                        }
                    }
                    else {
                        //fail if nickname is not provided
                        utils.showError('No domain url provided!', undefined);
                        resolve({ success: false });
                    }
                });
            }
        });
    });
}
exports.connect = connect;
function readPlayJson() {
    let playConfigFilePath = utils.playJsonPath();
    if (!utils.pathExists(playConfigFilePath)) {
        return { success: false };
    }
    else {
        return { success: true, play: JSON.parse(String(utils.readFile(playConfigFilePath))) };
    }
}
exports.readPlayJson = readPlayJson;
function readConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve) {
            if (utils.homeDir()) {
                //check if .playground folder exists or not
                if (utils.pathExists(playgroundFolder) && utils.pathExists(configFile)) {
                    let jsonString = String(utils.readFile(configFile));
                    let config = JSON.parse(jsonString);
                    config.origin = config.origin.replace(/\/$/, "");
                    resolve({ success: true, config: config });
                }
                else {
                    resolve({ success: false });
                }
            }
            else {
                utils.showError('Home directory not found!', undefined);
                resolve({ success: false });
            }
        });
    });
}
exports.readConfiguration = readConfiguration;
function checkSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve) {
            if (utils.homeDir()) {
                let result = { localSetup: false, directorySetup: false };
                //CHECK1: PLAYGROUND SETUP ON MACHINE
                //check if .playground folder exists or not
                if (utils.pathExists(playgroundFolder) && utils.pathExists(configFile)) {
                    result.localSetup = true;
                }
                //CHECK2: PLAYGROUND SETUP on DIRECTORY
                if (utils.pathExists(currPlaygroundFolder) && utils.pathExists(playJsonFile)) {
                    result.directorySetup = true;
                }
                resolve({ success: true, result: result });
            }
            else {
                utils.showError('Home directory not found!', undefined);
                resolve({ success: false });
            }
        });
    });
}
exports.checkSetup = checkSetup;
function getTypes(config) {
    return new Promise(function (resolve, reject) {
        let typesUrl = config.origin + '/config/types/vscode';
        request.post({ url: typesUrl, form: {}, headers: { Authorization: config.token } }, function optionalCallback(err, httpResponse, jsonBody) {
            let types = JSON.parse(jsonBody);
            if (types['UNAUTHORIZED']) {
                utils.showError(types['UNAUTHORIZED'], ['Reset Connection']).then(function (item) {
                    if (item === 'Reset Connection') {
                        connect(true);
                    }
                });
            }
            else {
                let typeOptions = [];
                types.forEach((type) => {
                    typeOptions.push(type.name);
                });
                request.get({ url: playgIgnoreSamplesRepoUrl }, function optionalCallback(err, httpResponse, body) {
                    if (httpResponse.statusCode === 200) {
                        let result = JSON.parse(body);
                        let links = {};
                        result.values.forEach((link) => {
                            links[link.path] = link.links.self.href;
                        });
                        resolve({ types: typeOptions, links: links });
                    }
                    else {
                        reject();
                    }
                });
            }
        });
    });
}
exports.getTypes = getTypes;
function showIgnoreOptions() {
    request.get({ url: playgIgnoreSamplesRepoUrl }, function optionalCallback(err, httpResponse, body) {
        if (httpResponse.statusCode === 200) {
            let result = JSON.parse(body);
            let links = {};
            result.values.forEach((link) => {
                if (link.path !== 'types.json') {
                    links[link.path] = link.links.self.href;
                }
            });
            utils.showPicker(Object.keys(links), 'Choose a sample ignore file').then(function (selected) {
                request.get({ url: links[selected] }, function optionalCallback(err, httpResponse, body) {
                    if (httpResponse.statusCode === 200) {
                        if (utils.pathExists(utils.currentDirPlaygIgnorePath())) {
                            utils.showError('There is already a .playgignore file. Overwrite is not allowed', []);
                        }
                        else {
                            utils.writeFile(utils.currentDirPlaygIgnorePath(), body);
                            utils.showInformation('Playground ignore file created successfully', []);
                        }
                    }
                    else {
                        console.error('Not able to retrieve sample file');
                        utils.showError('Sample ignore file not dowloaded. Pleae try again later', []);
                    }
                });
            });
        }
        else {
            console.error('Playgignore url not responding properly');
        }
    });
}
exports.showIgnoreOptions = showIgnoreOptions;
//# sourceMappingURL=config.js.map