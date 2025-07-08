//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn('announcement_employee', 'created_at', {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn('announcement_employee', 'updated_at', {
            type: DataTypes.DATE
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.removeColumn('announcement_employee', 'created_at');
        await queryInterface.removeColumn('announcement_employee', 'updated_at')
    }
}

