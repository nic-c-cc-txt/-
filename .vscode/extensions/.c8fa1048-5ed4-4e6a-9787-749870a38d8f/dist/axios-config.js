'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _commands = require('./commands/commands');

var _utils = require('./utils');

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function axiosConfig(context) {
  var _this = this;

  _axios2.default.interceptors.response.use(null, function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error) {
      var _error$config, url, method, data, status, cache, _ref2, authorization, authContent, tokenType, accessToken;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(error);

              if (!(!error || !error.config || !error.response)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', Promise.reject(error));

            case 3:
              _error$config = error.config, url = _error$config.url, method = _error$config.method, data = _error$config.data, status = error.response.status;

              if (!(status !== 401 || url.includes('refreshToken'))) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return', Promise.reject(error));

            case 6:
              cache = context.globalState.get(_constant.VSCODEFY_CACHE);
              _context.next = 9;
              return (0, _commands.refreshToken)(cache.refreshToken);

            case 9:
              _ref2 = _context.sent;
              authorization = _ref2.data;
              authContent = (0, _utils.getAuthContentFromData)(authorization);

              Object.assign(cache, authContent);
              context.globalState.update(_constant.VSCODEFY_CACHE, cache);
              tokenType = cache.tokenType, accessToken = cache.accessToken;

              _axios2.default.defaults.headers.common['Authorization'] = tokenType + ' ' + accessToken;

              (0, _axios2.default)({
                method: method,
                url: url,
                data: data
              });

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}

exports.default = axiosConfig;