import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class AnnouncementEmployee extends Model{}


AnnouncementEmployee.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    announcement_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'announcement', key: 'id'}
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: 'user', key: 'id'}
    }

}, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName:'announcement_employee',
    modelName: 'announcement_employee'
})

export default AnnouncementEmployee