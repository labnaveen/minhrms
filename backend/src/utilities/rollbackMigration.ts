import { Umzug } from "umzug"
import { migrationConf, sequelize } from "./db"



export const rollbackMigration = async() => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
}

rollbackMigration();
