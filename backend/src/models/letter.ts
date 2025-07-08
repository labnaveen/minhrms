import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import Documents from "./documents";
import User from "./user";
import LetterStatus from "./letterStatus";



class Letter extends Model{};


Letter.init({

    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Documents, key: 'id'}
    },
    letter_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: LetterStatus, key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'letter',
    modelName: 'letter'
})

export default Letter;