'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentTrackAsync = exports.pickDevice = exports.refreshToken = exports.getCode = exports.login = exports.play = exports.pause = exports.next = exports.previous = undefined;

var next = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios2.default.post(_constant.SPOTIFY_PLAYER_URL + '/next', {});

          case 3:
            _context.next = 9;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0);
            handler(_context.t0, previous);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function next() {
    return _ref.apply(this, arguments);
  };
}();

var previous = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _axios2.default.post(_constant.SPOTIFY_PLAYER_URL + '/previous', {});

          case 3:
            _context2.next = 9;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);

            console.error(_context2.t0);
            handler(_context2.t0, previous);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 5]]);
  }));

  return function previous() {
    return _ref2.apply(this, arguments);
  };
}();

var play = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _axios2.default.put(_constant.SPOTIFY_PLAYER_URL + '/play', {});

          case 3:
            _context3.next = 9;
            break;

          case 5:
            _context3.prev = 5;
            _context3.t0 = _context3['catch'](0);

            console.error(_context3.t0);
            handler(_context3.t0, play);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 5]]);
  }));

  return function play() {
    return _ref3.apply(this, arguments);
  };
}();

var pause = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _axios2.default.put(_constant.SPOTIFY_PLAYER_URL + '/pause', {});

          case 3:
            _context4.next = 9;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4['catch'](0);

            console.error(_context4.t0);
            handler(_context4.t0, pause);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 5]]);
  }));

  return function pause() {
    return _ref4.apply(this, arguments);
  };
}();

var getAvailableDevices = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var _ref6, devices;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _axios2.default.get(_constant.SPOTIFY_PLAYER_URL + '/devices');

          case 2:
            _ref6 = _context5.sent;
            devices = _ref6.data.devices;
            return _context5.abrupt('return', devices);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getAvailableDevices() {
    return _ref5.apply(this, arguments);
  };
}();

var getCurrentTrack = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var response, _response$data, progressMs, isPlaying, _response$data$item, durationMs, name;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _axios2.default.get(_constant.SPOTIFY_PLAYER_URL + '/currently-playing', {});

          case 2:
            response = _context7.sent;

            if (!(response.status === 204)) {
              _context7.next = 6;
              break;
            }

            _pubsubJs2.default.publish('current-track', {});
            return _context7.abrupt('return');

          case 6:
            _response$data = response.data, progressMs = _response$data.progress_ms, isPlaying = _response$data.is_playing, _response$data$item = _response$data.item, durationMs = _response$data$item.duration_ms, name = _response$data$item.name;

            _pubsubJs2.default.publish('current-track', { progressMs: progressMs, durationMs: durationMs, name: name, isPlaying: isPlaying });

          case 8:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getCurrentTrack() {
    return _ref8.apply(this, arguments);
  };
}();

var login = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _vscode.commands.executeCommand('vscode.open', _vscode.Uri.parse(_constant.OAUTH_SITE_URL));

          case 1:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function login() {
    return _ref9.apply(this, arguments);
  };
}();

var getCode = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var code, _ref11, authorization;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _vscode.window.showInputBox();

          case 2:
            code = _context9.sent;

            if (!(!code || (0, _utils.isLogged)(this.globalState.get(_constant.VSCODEFY_CACHE)))) {
              _context9.next = 5;
              break;
            }

            return _context9.abrupt('return');

          case 5:
            _context9.next = 7;
            return authorize(code);

          case 7:
            _ref11 = _context9.sent;
            authorization = _ref11.data;

            if (!authorization.statusCode) {
              _context9.next = 12;
              break;
            }

            _vscode.window.showErrorMessage('Spotify OAuth Code is wrong');
            return _context9.abrupt('return');

          case 12:
            _pubsubJs2.default.publish('signIn', authorization);

          case 13:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function getCode() {
    return _ref10.apply(this, arguments);
  };
}();

var authorize = function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(code) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', _axios2.default.get(_constant.OAUTH_SERVER_URL + '/authorize?code=' + code));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function authorize(_x) {
    return _ref12.apply(this, arguments);
  };
}();

var pickDevice = function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var _this2 = this;

    var deviceNotFound, devices, deviceNames, deviceSelected, device;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            deviceNotFound = function () {
              var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _vscode.window.showInformationMessage('Not found any available device, please connect on spotify in someone device');

                      case 2:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, _callee11, _this2);
              }));

              return function deviceNotFound() {
                return _ref14.apply(this, arguments);
              };
            }();

            _context12.next = 3;
            return getAvailableDevices();

          case 3:
            devices = _context12.sent;

            if (devices.length) {
              _context12.next = 8;
              break;
            }

            _context12.next = 7;
            return deviceNotFound();

          case 7:
            return _context12.abrupt('return', false);

          case 8:
            deviceNames = devices.map(function (_ref15) {
              var name = _ref15.name;
              return name;
            });
            _context12.next = 11;
            return _vscode.window.showQuickPick(deviceNames);

          case 11:
            deviceSelected = _context12.sent;
            device = devices.find(function (_ref16) {
              var name = _ref16.name;
              return name === deviceSelected;
            });

            if (device) {
              _context12.next = 15;
              break;
            }

            return _context12.abrupt('return', false);

          case 15:
            if (device.id) {
              _context12.next = 19;
              break;
            }

            _context12.next = 18;
            return deviceNotFound();

          case 18:
            return _context12.abrupt('return', false);

          case 19:
            _context12.next = 21;
            return _axios2.default.put(_constant.SPOTIFY_PLAYER_URL, { 'device_ids': [device.id] });

          case 21:
            return _context12.abrupt('return', true);

          case 22:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function pickDevice() {
    return _ref13.apply(this, arguments);
  };
}();

var refreshToken = function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(refreshToken) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt('return', _axios2.default.get(_constant.OAUTH_SERVER_URL + '/refreshToken?refreshToken=' + refreshToken));

          case 1:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function refreshToken(_x2) {
    return _ref17.apply(this, arguments);
  };
}();

var handler = function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(error) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return Promise.resolve();
    };
    var success;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            if (!(error && error.response && error.response.status === 404)) {
              _context14.next = 5;
              break;
            }

            _context14.next = 3;
            return handlerNotFoundDevice();

          case 3:
            success = _context14.sent;

            if (success) {
              setTimeout(function () {
                return callback();
              }, 300);
            }

          case 5:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function handler(_x4) {
    return _ref18.apply(this, arguments);
  };
}();

var handlerNotFoundDevice = function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            return _context15.abrupt('return', pickDevice());

          case 1:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function handlerNotFoundDevice() {
    return _ref19.apply(this, arguments);
  };
}();

var _vscode = require('vscode');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _utils = require('../utils');

var _constant = require('../constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getCurrentTrackAsync() {
  var _this = this;

  setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getCurrentTrack();

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  })), 500);
}

exports.previous = previous;
exports.next = next;
exports.pause = pause;
exports.play = play;
exports.login = login;
exports.getCode = getCode;
exports.refreshToken = refreshToken;
exports.pickDevice = pickDevice;
exports.getCurrentTrackAsync = getCurrentTrackAsync;