"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.up = function (state, cb) {
    var _a;
    var error;
    try {
        var key = state.get('gisttoken');
        state.update('gisttoken', undefined);
        state.update('gist_provider', undefined);
        if (key) {
            var url = constants_1.GISTS_BASE_URL;
            var name_1 = 'github';
            var active = true;
            state.update('profiles', (_a = {}, _a[name_1] = { active: active, key: key, url: url }, _a));
        }
    }
    catch (err) {
        error = err ? err : new Error('unknown migration error');
    }
    cb(error);
};
//# sourceMappingURL=migrate-2.0.0.js.map