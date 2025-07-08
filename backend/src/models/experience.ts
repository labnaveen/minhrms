import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class Experience extends Model{}


Experience.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: "user", key: 'id'}
    },
    company_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'employment_type', key: 'id'}
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    underscored: true,
    tableName: 'experience',
    modelName: 'experience'
})

export default Experience