//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.addColumn('user',
        'profile_image_id',
        {
            type: DataTypes.STRING,
            allowNull: true
        }
      )
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.removeColumn('user', 'profile_image')
    }
}