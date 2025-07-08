import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class FamilyMember extends Model{}

FamilyMember.init({

    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false
    },
    relation_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'relation', key: 'id'}
    },
    occupation:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'family_member',
    modelName: 'family_member'
})

export default FamilyMember;