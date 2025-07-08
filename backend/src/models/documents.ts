import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";


class Documents extends Model{}


Documents.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    public_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_file: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'documents',
    modelName: 'documents'

})

export default Documents