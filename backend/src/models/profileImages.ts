import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";





class ProfileImages extends Model{};



ProfileImages.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    public_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_images',
    modelName: 'profile_images'
})

export default ProfileImages;