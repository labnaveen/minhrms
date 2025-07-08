//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('letter', {
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
            document_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'documents', key: 'id'}
            },
            letter_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'letter_status', key: 'id' }
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
        await queryInterface.dropTable('letter')
    }
}