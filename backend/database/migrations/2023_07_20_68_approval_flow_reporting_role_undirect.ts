//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('approval_flow_reporting_role_undirect', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            approval_flow_id:{
                type: DataTypes.INTEGER,
                references: {model: 'approval_flow_reporting_role', key: 'id'}
            },
            reporting_role_id:{
                type: DataTypes.INTEGER,
                references: {model: 'approval_flow_reporting_role', key: 'id'}
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
        await queryInterface.dropTable('approval_flow_reporting_role_undirect')
    }
}