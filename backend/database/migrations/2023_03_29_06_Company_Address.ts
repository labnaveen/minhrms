//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('company_address', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        company_present_address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_present_pincode:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_present_city:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_present_state:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_present_country_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_present_mobile:{
            type: DataTypes.STRING,
            allowNull: false
        },
        company_permanent_address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_permanent_pincode:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_permanent_city:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_permanent_state:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_permanent_country_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_permanent_mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company_id:{
            type: DataTypes.INTEGER,
            references:{model: 'company', key: 'id'}
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
      await queryInterface.dropTable('company_address')
    }
}