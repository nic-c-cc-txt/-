"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
var constants_1 = require("../constants");
var extensionId = constants_1.EXTENSION_ID;
var extension = vscode_1.extensions.getExtension(extensionId);
var extensionVersion = (extension && extension.packageJSON && extension.packageJSON.version) || '';
var telemetryCohortMax = 100;
var telemetryCohortMin = 1;
var telemetryCohort = Math.floor(Math.random() * telemetryCohortMax) + telemetryCohortMin;
var enabled = function (debug) {
    if (debug === void 0) { debug = false; }
    if (debug ||
        (telemetryCohort >= constants_1.TELEMETRY_COHORT_RANGE[0] &&
            telemetryCohort <= constants_1.TELEMETRY_COHORT_RANGE[1])) {
        return true;
    }
    return false;
};
var TelemetryService = (function () {
    function TelemetryService() {
        this.enabled = enabled(constants_1.DEBUG);
        this.reporter = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, constants_1.TELEMETRY_WRITE_KEY);
    }
    TelemetryService.prototype.exception = function (context, properties, measurements) {
        this.track('exception', __assign({}, properties, { context: context }), __assign({}, measurements));
    };
    TelemetryService.prototype.track = function (eventName, properties, measurements) {
        if (!this.enabled) {
            return;
        }
        this.reporter.sendTelemetryEvent(eventName, __assign({}, properties), __assign({}, measurements));
    };
    TelemetryService.getInstance = function () {
        return TelemetryService.instance
            ? TelemetryService.instance
            :
                new TelemetryService();
    };
    return TelemetryService;
}());
exports.telemetry = TelemetryService.getInstance();
//# sourceMappingURL=telemetry-service.js.map