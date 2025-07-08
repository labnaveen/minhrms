//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('announcement', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            title:{
                type: DataTypes.STRING,
                allowNull: false
            },
            suspendable:{
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            group_specific: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            start_date:{
                type: DataTypes.DATE,
                allowNull: true
            },
            end_date:{
                type: DataTypes.DATE,
                allowNull: true
            },
            deleted_at:{
                type: DataTypes.DATE
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('announcement')
    }
}