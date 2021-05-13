'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deactivate = deactivate;
exports.activate = activate;

require('babel-polyfill');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _axiosConfig = require('./axios-config');

var _axiosConfig2 = _interopRequireDefault(_axiosConfig);

var _vscode = require('vscode');

var _commands = require('./commands/commands');

var _utils = require('./utils');

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var refreshStatusId = void 0;
var allStatusBar = void 0;
var loginStatusBar = void 0;
var configureStatusBar = void 0;
function deactivate() {
  logout();
}

function logout() {
  if (!(0, _utils.validCache)(this.globalState.get(_constant.VSCODEFY_CACHE))) {
    return;
  }
  clearInterval(refreshStatusId);
  this.globalState.update(_constant.VSCODEFY_CACHE, null);
  allStatusBar.map(function (status) {
    return status.dispose();
  });
  var initialButtons = createInitialButtons();
  loginStatusBar = initialButtons.loginStatusBar;
  configureStatusBar = initialButtons.configureStatusBar;
  this.subscriptions.push(_vscode.Disposable.from(loginStatusBar, configureStatusBar));
}

function activate(context) {
  (0, _axiosConfig2.default)(context);

  var reference = commandsRegistered.map(function (_ref) {
    var command = _ref.command,
        action = _ref.action;
    return _vscode.commands.registerCommand(command, action, context);
  });

  var initialButtons = createInitialButtons();
  loginStatusBar = initialButtons.loginStatusBar;
  configureStatusBar = initialButtons.configureStatusBar;
  _pubsubJs2.default.subscribe('signIn', function (message, data) {
    var authContent = (0, _utils.getAuthContentFromData)(data);
    context.globalState.update(_constant.VSCODEFY_CACHE, authContent);
    setup(authContent, context);
  });

  context.subscriptions.push(_vscode.Disposable.from.apply(_vscode.Disposable, _toConsumableArray(reference).concat([loginStatusBar, configureStatusBar])));
  var cache = context.globalState.get(_constant.VSCODEFY_CACHE);
  if ((0, _utils.validCache)(cache)) {
    setup(cache, context);
  }
}

function setup(authContent, context) {
  var tokenType = authContent.tokenType,
      accessToken = authContent.accessToken;

  _axios2.default.defaults.headers.common['Authorization'] = tokenType + ' ' + accessToken;

  loginStatusBar.dispose();
  configureStatusBar.dispose();
  var StatusBarButtons = buttonsInfo.map(function (_ref2) {
    var text = _ref2.text,
        priority = _ref2.priority,
        buttonCommand = _ref2.buttonCommand,
        tooltip = _ref2.tooltip;

    var status = _vscode.window.createStatusBarItem(_vscode.StatusBarAlignment.Left, priority);
    status.text = text;
    status.command = buttonCommand;
    status.tooltip = tooltip;
    status.show();
    return status;
  });
  var statusCurrentMusic = _vscode.window.createStatusBarItem(_vscode.StatusBarAlignment.Left, 7);
  statusCurrentMusic.text = 'Current Music';
  statusCurrentMusic.tooltip = 'Current Music';
  statusCurrentMusic.hide();

  var pauseButton = StatusBarButtons.find(function (_ref3) {
    var command = _ref3.command;
    return command === 'vscodefy.pause';
  });
  var playButton = StatusBarButtons.find(function (_ref4) {
    var command = _ref4.command;
    return command === 'vscodefy.play';
  });
  var switchStatusButton = function switchStatusButton(isPlaying) {
    if (isPlaying) {
      playButton.hide();
      pauseButton.show();
    } else {
      pauseButton.hide();
      playButton.show();
    }
  };
  _pubsubJs2.default.subscribe('current-track', function (message, _ref5) {
    var _ref5$name = _ref5.name,
        name = _ref5$name === undefined ? undefined : _ref5$name,
        _ref5$isPlaying = _ref5.isPlaying,
        isPlaying = _ref5$isPlaying === undefined ? false : _ref5$isPlaying;

    statusCurrentMusic.text = name ? '$(unmute)  ' + name : '';
    statusCurrentMusic.tooltip = name || '';
    statusCurrentMusic.show();
    switchStatusButton(isPlaying);
  });
  _pubsubJs2.default.publishSync('current-track', {});

  refreshStatusId = setInterval(function () {
    return (0, _commands.getCurrentTrackAsync)();
  }, 10000);
  allStatusBar = [].concat(_toConsumableArray(StatusBarButtons), [statusCurrentMusic]);
  context.subscriptions.push(_vscode.Disposable.from.apply(_vscode.Disposable, _toConsumableArray(allStatusBar)));
}

function createInitialButtons() {
  var loginStatusBar = createStatusBarItem({ priority: 11, text: '$(sign-in) Login', command: 'vscodefy.login', tooltip: 'Login on Spotify' });
  var configureStatusBar = createStatusBarItem({ priority: 10, text: '$(gear) Configure', command: 'vscodefy.getCode', tooltip: 'Configure OAuth Spotify Code' });
  return { loginStatusBar: loginStatusBar, configureStatusBar: configureStatusBar };
}

function createStatusBarItem(_ref6) {
  var priority = _ref6.priority,
      text = _ref6.text,
      command = _ref6.command,
      tooltip = _ref6.tooltip;

  var statusBar = _vscode.window.createStatusBarItem(_vscode.StatusBarAlignment.Left, priority);
  statusBar.text = text;
  statusBar.command = command;
  statusBar.tooltip = tooltip;
  statusBar.show();
  return statusBar;
}
var buttonsInfo = [{
  id: 'next',
  text: ' $(chevron-right) ',
  priority: 8,
  tooltip: 'Next',
  buttonCommand: 'vscodefy.next'
}, {
  id: 'play',
  text: ' $(triangle-right) ',
  priority: 9,
  tooltip: 'Play',
  buttonCommand: 'vscodefy.play'
}, {
  id: 'pause',
  text: ' $(primitive-square) ',
  priority: 10,
  tooltip: 'Pause',
  buttonCommand: 'vscodefy.pause'
}, {
  id: 'previous',
  text: ' $(chevron-left) ',
  priority: 11,
  tooltip: 'Previous',
  buttonCommand: 'vscodefy.previous'
}];

var commandsRegistered = [{
  command: 'vscodefy.next',
  action: _commands.next
}, {
  command: 'vscodefy.previous',
  action: _commands.previous
}, {
  command: 'vscodefy.play',
  action: _commands.play
}, {
  command: 'vscodefy.pause',
  action: _commands.pause
}, {
  command: 'vscodefy.login',
  action: _commands.login
}, {
  command: 'vscodefy.getCode',
  action: _commands.getCode
}, {
  command: 'vscodefy.pickDevice',
  action: _commands.pickDevice
}, {
  command: 'vscodefy.logout',
  action: logout
}];