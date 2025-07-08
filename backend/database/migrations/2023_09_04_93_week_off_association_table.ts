//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('weekly_off_association', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            weekly_off_policy_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'weekly_off_policy', key: 'id'}
            },
            week_name:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'week', key: 'id'}
            },
            week_number:{
                type: DataTypes.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable('weekly_off_association')
    }
}