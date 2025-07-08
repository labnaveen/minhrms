//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.changeColumn('regularization_record', 'in_time', {
            type: DataTypes.DATE
        }),
        await queryInterface.changeColumn('regularization_record', 'out_time', {
            type: DataTypes.DATE,
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.changeColumn('attendance', 'in_time', {
            type: DataTypes.TIME
        }),
        await queryInterface.changeColumn('attendance', 'out_time', {
            type: DataTypes.TIME,
        })
    }
}