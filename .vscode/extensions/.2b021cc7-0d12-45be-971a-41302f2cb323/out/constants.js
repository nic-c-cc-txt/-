"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
exports.EXTENSION_ID = 'kenhowardpdx.vscode-gist';
exports.DEBUG = process.env.DEBUG === 'true';
exports.GISTS_BASE_URL = 'https://api.github.com';
exports.GISTS_PER_PAGE = 9999;
exports.LOGGER_LEVEL = 3;
exports.TELEMETRY_COHORT_RANGE = [0, 75];
exports.TELEMETRY_WRITE_KEY = buffer_1.Buffer.from('YzgzYjU2NGMtYTdmNS00MmVjLTkxNGEtOWZiYjViYzM2NjU5', 'base64').toString();
exports.TMP_DIRECTORY_PREFIX = 'vscode_gist';
//# sourceMappingURL=constants.js.map