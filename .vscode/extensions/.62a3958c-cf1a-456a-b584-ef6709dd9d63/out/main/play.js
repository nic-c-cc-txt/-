"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configUtils = require("./config");
const utils = require("./utils");
const request = require('request');
const zip = require("node-native-zip");
const glob = require('glob');
function openLink() {
    configUtils.connect(false).then(function (config) {
        let playgroundConfig = config["config"];
        let playResult = configUtils.readPlayJson();
        if (playResult.success && playResult.play.url) {
            let openLink = playgroundConfig.origin + '/play/' + playResult.play.url;
            utils.openLink(utils.uri(openLink));
        }
        else {
            utils.showError('No configuration found!', undefined);
        }
    });
}
exports.openLink = openLink;
function createUpdatePlay(create) {
    configUtils.connect(false).then(function (config) {
        if (config["success"]) {
            let currentDir = utils.currentDir();
            let playgroundConfig = config["config"];
            if (currentDir) {
                let playConfig = checkPlaygroundFolder();
                //check for operation and config
                if (create && playConfig.id !== 'new') {
                    utils.showError('This is already a play. Do you want to update instead?', ['Update Play']).then(function (item) {
                        if (item === 'Update Play') {
                            createUpdatePlay(false);
                        }
                    });
                    return;
                }
                else if (!create && playConfig.id === 'new') {
                    utils.showError('This seems to be a new play. Do you want to create a new play instead?', ['Create Play']).then(function (item) {
                        if (item === 'Create Play') {
                            createUpdatePlay(true);
                        }
                    });
                    return;
                }
                askTitle(playConfig).then(function (title) {
                    createZipOfCurrentFolder().then(function (zipFolder) {
                        //send zip file to server first
                        sendZipFile(zipFolder, playgroundConfig, playConfig).then(function () {
                            //if files are accepted properly, send play details
                            sendPlayDetails(title, zipFolder, playgroundConfig, playConfig).then(function (play) {
                                createPlayFile(play);
                                let successMsg;
                                if (create) {
                                    successMsg = 'Play created successfully';
                                }
                                else {
                                    successMsg = 'Play updated successfully';
                                }
                                utils.showInformation(successMsg, ['Open Play']).then(function (item) {
                                    if (item === 'Open Play') {
                                        let openLink = playgroundConfig.origin + '/play/' + play.url;
                                        utils.openLink(utils.uri(openLink));
                                    }
                                });
                            }).catch(function (errorMsg) {
                                utils.showError(errorMsg, undefined);
                            });
                        }).catch(function (errorMsg) {
                            utils.showError(errorMsg, undefined);
                        });
                    }).catch(function (errorMsg) {
                        utils.showError(errorMsg, undefined);
                    });
                }).catch(function (errorMsg) {
                    utils.showError(errorMsg, undefined);
                });
            }
            else {
                utils.showError('There is no open folder!', undefined);
            }
        }
        else {
            utils.showError('No Configuration Found!', undefined);
        }
    }).catch(function (errorMsg) {
        utils.showError(errorMsg, undefined);
    });
}
exports.createUpdatePlay = createUpdatePlay;
function createPlayFile(play) {
    utils.writeFile(utils.playJsonPath(), JSON.stringify(play, null, 2));
}
function checkPlaygroundFolder() {
    let playgroundfolder = utils.currentDirPlaygroundPath();
    if (!utils.pathExists(playgroundfolder)) {
        utils.mkDir(playgroundfolder);
        return { id: 'new' };
    }
    else {
        let playConfigFilePath = utils.playJsonPath();
        if (!utils.pathExists(playConfigFilePath)) {
            return { id: 'new' };
        }
        else {
            let playConfig = JSON.parse(String(utils.readFile(playConfigFilePath)));
            if (!playConfig.id) {
                playConfig.id = 'new';
            }
            return playConfig;
        }
    }
}
function sendPlayDetails(title, zipFolder, config, playConfig) {
    return new Promise(function (resolve, reject) {
        //end point to hit to server
        var target = config.origin + '/play/' + playConfig.id + '/vscode/' + config.nickname;
        //authorization header
        let headers = { Authorization: config.token };
        //send type of folder in request
        let body = { play: playConfig };
        body.play.title = title;
        utils.showProgress({ title: "Sending Package to Playground" }, () => {
            return new Promise(function (progressResolve) {
                request.post({ url: target, body: body, headers: headers, json: true }, function optionalCallback(err, httpResponse, body) {
                    console.log(httpResponse);
                    if (httpResponse.statusCode === 200) {
                        let result = body;
                        if (result["NO_MATCH"]
                            || result["UNAUTHORIZED"]
                            || result["DUPLICATE_PLAY"]
                            || result["PENDING_PLAY"]
                            || result["ERROR"]) {
                            if (result['UNAUTHORIZED']) {
                                progressResolve();
                                utils.showError(result['UNAUTHORIZED'], ['Reset Connection']).then(function (item) {
                                    if (item === 'Reset Connection') {
                                        configUtils.connect(true);
                                    }
                                });
                            }
                            else {
                                progressResolve();
                                reject(result["NO_MATCH"] || result["DUPLICATE_PLAY"] || result["PENDING_PLAY"] || result["PENDING_PLAY"] || result["ERROR"]);
                            }
                        }
                        else {
                            if (httpResponse.statusCode === 200) {
                                console.log('Play successful!  Server responded with:', result);
                                progressResolve();
                                resolve(result);
                            }
                            else {
                                progressResolve();
                                reject('Something happened while creating a play. Please try again later!');
                            }
                        }
                    }
                    else {
                        progressResolve();
                        reject('Something happened while creating a play. Please try again later!');
                    }
                });
            });
        });
    });
}
function askTitle(playConfig) {
    return new Promise(function (resolve, reject) {
        if (playConfig.id === 'new' && !playConfig.title) {
            utils.showInputBox({ placeHolder: 'Enter your play title' }).then(function (title) {
                if (title) {
                    resolve(title);
                }
                else {
                    reject('No title provided!');
                }
            });
        }
        else {
            resolve(playConfig.title);
        }
    });
}
function sendZipFile(zipFolder, config, playConfig) {
    return new Promise(function (resolve, reject) {
        utils.showProgress({ title: "Zipping files" }, () => {
            return new Promise(function (progressResolve) {
                //end point to hit to server
                var target = config.origin + '/play/' + playConfig.id + '/vscode/' + config.nickname + '/files';
                //authorization header
                let headers = { Authorization: config.token };
                //read stream to create a readStream and upload file
                var rs = utils.createReadStream(zipFolder.path);
                var ws = request.post({ url: target, headers: headers });
                ws.on('drain', function () {
                    rs.resume();
                });
                ws.on('error', function (err) {
                    console.log('Error', err);
                    progressResolve();
                    reject('Something happened while uploading package to server. Please try again later!');
                });
                ws.on('response', function (response) {
                    if (response.statusCode === 200) {
                        progressResolve();
                        resolve();
                    }
                    else {
                        progressResolve();
                        reject('Something happened while uploading package to server. Please try again later!');
                    }
                });
                //Pipe the zip file with request
                rs.pipe(ws);
            });
        });
    });
}
function getAllFiles() {
    return new Promise(function (resolve, reject) {
        glob("**/*", { "cwd": utils.currentDir(), "ignore": utils.readIgnoreFile(), dot: true }, function (err, files) {
            if (err)
                reject(err);
            let allFiles = [];
            files.forEach(file => {
                let filePath = utils.currentDir() + '/' + file;
                if (!utils.isDirectory(filePath)) {
                    allFiles.push({ name: file, path: filePath });
                }
            });
            resolve(allFiles);
        });
    });
}
function createZipOfCurrentFolder() {
    return new Promise(function (resolve, reject) {
        getAllFiles().then(function (options) {
            //prepare archive to zip all selected files
            let archive = new zip();
            let zipFolderPath = utils.currentDir() + '/.playground/play.zip';
            archive.addFiles(options, function (err) {
                if (err)
                    return console.log("err while adding files", err);
                let buff = archive.toBuffer();
                let writeFile = utils.writeFile(zipFolderPath, buff);
                resolve({ path: zipFolderPath });
            });
        }).catch(function (error) {
            reject(error);
        });
    });
}
//# sourceMappingURL=play.js.map