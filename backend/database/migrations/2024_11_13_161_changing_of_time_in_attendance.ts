//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        // await queryInterface.('attendance', {
        //     id:{
        //         type: DataTypes.INTEGER,
        //         autoIncrement: true,
        //         primaryKey: true,
        //     },
        // })
        await queryInterface.changeColumn('attendance', 'punch_in_time', {
            type: DataTypes.DATE
        }),
        await queryInterface.changeColumn('attendance', 'punch_out_time', {
            type: DataTypes.DATE,
            allowNull: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.changeColumn('attendance', 'punch_in_time', {
            type: DataTypes.TIME
        }),
        await queryInterface.changeColumn('attendance', 'punch_out_time', {
            type: DataTypes.TIME,
            allowNull: true
        })
    }
}