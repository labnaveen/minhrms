//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("regularization_record", "user_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'user', key:'id' }
        });
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("regularization_record", "user_id");
    }
}