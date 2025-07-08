//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("profile_images", "user_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'user', key: 'id' }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("profile_images", "user_id");
    }
}