"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.rollbackMigration = exports.migrationConf = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const umzug_1 = require("umzug");
const config_1 = require("./config");
exports.sequelize = new sequelize_1.Sequelize(config_1.DATABASE, config_1.DB_USER, config_1.DB_PASSWORD, {
    host: config_1.DB_HOST,
    port: config_1.DB_PORT,
    dialect: 'mysql',
    define: {
        freezeTableName: true
    },
    timezone: '+05:30'
});
exports.migrationConf = {
    migrations: {
        glob: 'database/migrations/*.ts',
    },
    storage: new umzug_1.SequelizeStorage({ sequelize: exports.sequelize, tableName: 'migrations' }),
    context: exports.sequelize.getQueryInterface(),
    logger: console
};
const runMigrations = async () => {
    const migrator = new umzug_1.Umzug(exports.migrationConf);
    const migrations = await migrator.up();
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    });
};
const rollbackMigration = async () => {
    await exports.sequelize.authenticate();
    const migrator = new umzug_1.Umzug(exports.migrationConf);
    await migrator.down();
};
exports.rollbackMigration = rollbackMigration;
const connectToDatabase = async () => {
    try {
        await exports.sequelize.authenticate();
        await runMigrations();
        console.log(`Connected to Database Succesfully! on Port - ${config_1.DB_PORT}`);
    }
    catch (err) {
        console.log(config_1.DB_PORT);
        console.log('Failed to connect to Database!', err);
        return process.exit(1);
    }
    return null;
};
exports.connectToDatabase = connectToDatabase;
