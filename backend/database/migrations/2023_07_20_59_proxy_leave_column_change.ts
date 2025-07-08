//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.renameColumn("base_leave_configuration", "proxy_leave_by", "proxy_leave_application"),
    await queryInterface.changeColumn("base_leave_configuration", "proxy_leave_application", {
        type: DataTypes.BOOLEAN,
        allowNull: true
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.renameColumn("attendance_policy", "proxy_leave_application", "proxy_leave_by");
    await queryInterface.changeColumn("attendance_policy", "proxy_leave_by", {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },
};


