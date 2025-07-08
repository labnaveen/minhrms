//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.addColumn('leave_type',
        'leave_application_after',
        {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
      );
      await queryInterface.addColumn('leave_type', 'inbetween_holiday_sandwhich_rule', {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      })
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.removeColumn('leave_type', 'leave_application_after');
      await queryInterface.removeColumn('leave_type', 'inbetween_holiday_sandwhich_rule')
    }
}