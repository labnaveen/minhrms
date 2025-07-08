//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('employee_address', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        employee_present_address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        employee_present_pincode:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_present_city:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        employee_present_state:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        employee_present_country_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_present_mobile:{
            type: DataTypes.STRING,
            allowNull: false
        },
        employee_permanent_address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        employee_permanent_pincode:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_permanent_city:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        employee_permanent_state:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        employee_permanent_country_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_permanent_mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id:{
            type: DataTypes.INTEGER,
            references:{model: 'user', key: 'id'}
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
        },
      })

    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.dropTable('employee_address')
    }
}