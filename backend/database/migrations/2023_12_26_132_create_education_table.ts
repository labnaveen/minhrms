//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('education', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                reference: {model: 'user', key: 'id'}
            },
            institution_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            degree_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'education_type', key: 'id' }
            },
            course_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            field_of_study: {
                type: DataTypes.STRING,
                allowNull: true
            },
            year_of_completion: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            percentage: {
                type: DataTypes.INTEGER,
                allowNull: true
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
        await queryInterface.dropTable('education')
    }
}