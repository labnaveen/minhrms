//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('attendance', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            user_id:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            employee_generated_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date:{
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            punch_in_time:{
                type: DataTypes.TIME,
            },
            punch_out_time:{
                type: DataTypes.TIME,
            },
            status:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            is_deleted:{
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
        await queryInterface.dropTable('attendance')
    }
}