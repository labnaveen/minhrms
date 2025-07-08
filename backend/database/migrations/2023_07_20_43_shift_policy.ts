//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('shift_policy', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            shift_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            shift_description:{
                type: DataTypes.STRING,
                allowNull: true
            },
            notes_for_punch: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            allow_single_punch:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            shift_type_id: {
                type: DataTypes.INTEGER,
            },
            shift_start_time:{
                type: DataTypes.STRING,
                allowNull: true
            },
            shift_end_time:{
                type: DataTypes.STRING,
                allowNull: true
            },
            pre_shift_duration:{
                type: DataTypes.STRING,
                allowNull: true
            },
            post_shift_duration:{
                type: DataTypes.STRING,
                allowNull: true
            },
            consider_breaks:{
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            break_duration:{
                type: DataTypes.STRING,
                allowNull: true
            },
            break_start_time:{
                type: DataTypes.STRING,
                allowNull: true
            },
            break_end_time:{
                type: DataTypes.STRING,
                allowNull: true
            },
            enable_grace:{
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            grace_duration_allowed:{
                type:DataTypes.STRING,
                allowNull: true
            },
            number_of_days_grace_allowed:{
                type: DataTypes.STRING,
                allowNull: true
            },
            status_grace_exceeded:{
                type: DataTypes.INTEGER,
            },
            enable_grace_recurring:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            enable_flex:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            flex_start_time:{
                type: DataTypes.STRING,
                allowNull: true
            },
            flexi_duration_allowed:{
                type: DataTypes.STRING,
                allowNull: true
            },
            number_of_days_flexi_allowed:{
                type: DataTypes.STRING,
                allowNull: true
            },
            status_flexi_exceeded:{
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            exceeded_flexi_time_limit:{
                type: DataTypes.STRING,
                allowNull: true
            },
            enable_flex_recurring:{
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
        await queryInterface.dropTable('shift_policy')
    }
}