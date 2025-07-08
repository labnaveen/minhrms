//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('approval_flow', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            description:{
                type: DataTypes.STRING,
                allowNull: true
            },
            approval_flow_type_id:{
                type: DataTypes.INTEGER,
                references: {model: 'approval_flow_type', key: 'id'}
            },
            confirm_by_both_direct_undirect:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmation_by_all:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmation_by_all_direct:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmation_by_all_indirect: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('approval_flow')
    }
}