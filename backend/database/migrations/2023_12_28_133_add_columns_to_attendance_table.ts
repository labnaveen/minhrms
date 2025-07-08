//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("attendance", "flexi_used", {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }),
        await queryInterface.addColumn("attendance", "grace_used", {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }),
        await queryInterface.addColumn("attendance", "flexi_counter", {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        }),
        await queryInterface.addColumn("attendance", "grace_counter", {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        })  
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("attendance", "flexi_used");
        await queryInterface.deleteColumn("attendance", "grace_used");
        await queryInterface.deleteColumn("attendance", "flexi_counter");
        await queryInterface.deleteColumn("attendance", "grace_counter");
    }
}