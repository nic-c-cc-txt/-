"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var logger_1 = require("../logger");
var MigrationService = (function () {
    function MigrationService() {
        this.migrations = [];
        this.state = vscode_1.workspace.getConfiguration();
    }
    MigrationService.prototype.configure = function (options) {
        this.state = options.state;
        this.migrations = options.migrations;
    };
    MigrationService.prototype.up = function (cb) {
        var _this = this;
        var migrated = [];
        var error;
        try {
            this.migrations.forEach(function (m) {
                var migrationName = m[0], migrationFn = m[1];
                if (_this.do(migrationName)) {
                    logger_1.logger.debug("migrating " + migrationName);
                    migrationFn(_this.state, function (err) {
                        if (err) {
                            logger_1.logger.error("could not migrate to " + migrationName);
                            throw err;
                        }
                        _this.recordMigration(migrationName);
                        migrated.push(migrationName);
                    });
                }
            });
        }
        catch (err) {
            error = err;
        }
        cb(error, { migrated: migrated });
    };
    MigrationService.prototype.do = function (migrationName) {
        var pastMigrations = this.state.get('migrations', '').split(';');
        return pastMigrations.indexOf(migrationName) === -1;
    };
    MigrationService.prototype.recordMigration = function (migrationName) {
        var pastMigrations = this.state.get('migrations', '').split(';');
        pastMigrations.push(migrationName);
        this.state.update('migrations', pastMigrations.join(';'));
        logger_1.logger.debug("Applied Migration: " + migrationName);
    };
    MigrationService.getInstance = function () {
        return (MigrationService.instance = MigrationService.instance
            ? MigrationService.instance
            :
                new MigrationService());
    };
    return MigrationService;
}());
exports.migrations = MigrationService.getInstance();
//# sourceMappingURL=migration-service.js.map