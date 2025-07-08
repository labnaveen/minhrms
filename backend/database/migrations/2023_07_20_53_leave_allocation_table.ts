//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('leave_allocation', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            leave_type_policy_id:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            month_number:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            allocated_leaves:{
                type: DataTypes.INTEGER,
                AllowNull: false
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
        await queryInterface.dropTable('leave_allocation')
    }
}