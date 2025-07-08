//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.addColumn('user',
        'company_id',
        {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      )
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.dropTable('user')
    }
}