//@ts-nocheck

import { QueryInterface, DataTypes } from "sequelize";


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('company', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey:true,
                unique: true,
                autoIncrement: true
            },
            company_name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            company_email:{
                type: DataTypes.TEXT,
                allowNull: false,
            },
            company_mobile:{
                type: DataTypes.BIGINT,
                allowNull: false
            },
            teamsize: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            industry_id:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            domain:{
                type: DataTypes.CHAR,
                allowNull: false,
                unique: true
            },
            pan:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            gst: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            company_prefix:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            is_deleted: {
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
      await queryInterface.dropTable('company')
    }
}