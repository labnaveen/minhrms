import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class AnnouncementDivisionUnit extends Model{}


AnnouncementDivisionUnit.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    announcement_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'announcement', key: 'id'}
    },
    division_unit_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'division_units', key: 'id'}
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'announcement_division_unit',
    modelName: 'announcement_division_unit'
})

export default AnnouncementDivisionUnit