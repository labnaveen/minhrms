//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("base_leave_configuration", "notify_peer_mandatory", {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }),
    await queryInterface.changeColumn("base_leave_configuration", "proxy_leave_application", {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.removeColumn("base_leave_configuration", "notify_peer_mandatory");
    await queryInterface.changeColumn("base_leave_configuration", "proxy_leave_application", {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },
};


