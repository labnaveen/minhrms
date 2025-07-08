//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("shift_policy", "shift_start_time", {
        type: DataTypes.TIME,
        allowNull: true
    }),
    await queryInterface.changeColumn("shift_policy", "shift_end_time", {
        type: DataTypes.TIME,
        allowNull: true
    }),
    await queryInterface.changeColumn("shift_policy", "pre_shift_duration", {
        type: DataTypes.FLOAT,
        allowNull: true
    }),
    await queryInterface.changeColumn("shift_policy", "post_shift_duration", {
        type: DataTypes.FLOAT,
        allowNull: true
    }),
    await queryInterface.changeColumn("shift_policy", "break_duration", {
        type: DataTypes.FLOAT,
        allowNull: true
    }),
    await queryInterface.changeColumn("shift_policy", "break_start_time", {
        type: DataTypes.TIME,
        allowNull: true
    }),

    await queryInterface.changeColumn("shift_policy", "break_end_time", {
        type: DataTypes.TIME,
        allowNull: true
    }),

    await queryInterface.changeColumn("shift_policy", "flex_start_time", {
        type: DataTypes.FLOAT,
        allowNull: true
    }),

    await queryInterface.changeColumn("shift_policy", "flexi_duration_allowed",{
        type: DataTypes.FLOAT,
        allowNull: true
    })

  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("shift_policy", "working_hours", {
      type: DataTypes.STRING
    })
  },
};


