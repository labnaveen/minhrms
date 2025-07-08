//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn('announcement', 'created_at', {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn('announcement', 'updated_at', {
            type: DataTypes.DATE
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.removeColumn('announcement', 'created_at');
        await queryInterface.removeColumn('announcement', 'updated_at')
    }
}