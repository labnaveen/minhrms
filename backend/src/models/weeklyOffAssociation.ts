import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class WeeklyOffAssociation extends Model{}


WeeklyOffAssociation.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    weekly_off_policy_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'weekly_off_policy', key: 'id'}
    },
    week_name:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'week', key: 'id'}
    },
    week_number:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'weekly_off_association',
    modelName: 'weekly_off_association'
})

export default WeeklyOffAssociation;