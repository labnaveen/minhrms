import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class Education extends Model{}

Education.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
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
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'education',
    modelName: 'education'
})

export default Education;