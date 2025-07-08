//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("leave_type", "prorated_rounding_factor", {
        type: DataTypes.FLOAT,
        allowNull: true
    });
    await queryInterface.changeColumn("leave_type", "max_leaves_for_encashment", {
        type: DataTypes.FLOAT,
        allowNull: true
    });
    await queryInterface.changeColumn("leave_type", "carry_forward_rounding_factor", {
        type: DataTypes.FLOAT,
        allowNull: true
    });
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("leave_type", "proxy_leave_by", {
      type: DataTypes.DECIMAL,
      allowNull: true
    });
    await queryInterface.changeColumn("leave_type", "max_leaves_for_encashment", {
        type: DataTypes.DECIMAL,
        allowNull: true
    });
    await queryInterface.changeColumn("leave_type", "carry_forward_rounding_factor", {
        type: DataTypes.DECIMAL,
        allowNull: true
    });
  },
};


