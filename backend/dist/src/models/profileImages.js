"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ProfileImages extends sequelize_1.Model {
}
;
ProfileImages.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    public_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_images',
    modelName: 'profile_images'
});
exports.default = ProfileImages;
