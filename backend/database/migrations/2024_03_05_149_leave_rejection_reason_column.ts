//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("leave_record", "reject_reason", {
            type: DataTypes.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("leave_record", "last_action_by", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'user', key: 'id'}
        });
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("leave_record", "reject_reason");
        await queryInterface.deleteColumn("leave_record", "last_action_by");
    }
}