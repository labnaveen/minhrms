//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('profile_change_record', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'user', key: 'id'}
            },
            section: {
                type: DataTypes.STRING,
                allowNull: false
            },
            previous: {
                type: DataTypes.JSON,
                allowNull: false
            },
            change: {
                type: DataTypes.JSON,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{model:'approval_status', key: 'id'},
                defaultValue: 1
            },
            created_at:{
                type: DataTypes.DATE
            },
            updated_at:{
                type: DataTypes.DATE
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('profile_change_record')
    }
}