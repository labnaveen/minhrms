//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("leave_record", "half_day_type_id", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'half_day_type', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("leave_record", "half_day_type_id");
    }
}