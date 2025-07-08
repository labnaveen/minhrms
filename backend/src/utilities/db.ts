import { Sequelize } from "sequelize"
import { SequelizeStorage, Umzug } from "umzug"
import { DATABASE, DB_HOST, DB_PORT, DB_PASSWORD, DB_USER } from "./config"


export const sequelize = new Sequelize(DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    define:{
        freezeTableName: true
    },
    // timezone: '+05:30'
})

export const migrationConf = {
    migrations: {
        glob: 'database/migrations/*.ts',
    },
    storage: new SequelizeStorage({sequelize, tableName:'migrations'}),
    context: sequelize.getQueryInterface(),
    logger: console
}


const runMigrations = async() => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    })
}

export const rollbackMigration = async() => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
}


export const connectToDatabase = async() => {
    try{
        await sequelize.authenticate()
        await runMigrations()
        console.log(`Connected to Database Succesfully! on Port - ${DB_PORT}`)
    }
    catch(err){
        console.log(DB_PORT)
        console.log('Failed to connect to Database!', err)
        return process.exit(1)
    }

    return null
}