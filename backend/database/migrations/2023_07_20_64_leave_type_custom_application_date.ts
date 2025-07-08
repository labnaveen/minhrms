//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.addColumn('leave_type',
        'custom_leave_application_date',
        {
            type: DataTypes.DATE,
            allowNull: true,
        }
      )
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.removeColumn('leave_type', 'custom_leave_application_date');
    }
}