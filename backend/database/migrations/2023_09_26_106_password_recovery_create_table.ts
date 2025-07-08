//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('password_recovery', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            email:{
                type: DataTypes.STRING,
                allowNull: false
            },
            phone:{
                type: DataTypes.STRING,
                allowNull: true
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sent_at:{
                type: DataTypes.DATE,
                allowNull: false,
            },
            expires_at:{
                type: DataTypes.DATE,
                allowNull: false
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
        await queryInterface.dropTable('password_recovery')
    }
}