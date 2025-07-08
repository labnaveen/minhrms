"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackMigration = void 0;
const umzug_1 = require("umzug");
const db_1 = require("./db");
const rollbackMigration = async () => {
    await db_1.sequelize.authenticate();
    const migrator = new umzug_1.Umzug(db_1.migrationConf);
    await migrator.down();
};
exports.rollbackMigration = rollbackMigration;
(0, exports.rollbackMigration)();
