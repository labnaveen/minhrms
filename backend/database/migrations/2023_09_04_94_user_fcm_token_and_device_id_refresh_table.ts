//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.addColumn('refresh', 'device_id',
        {
            type: DataTypes.STRING,
            allowNull: true
        }),
      await queryInterface.addColumn('refresh', 'fcm_token',
        {
            type: DataTypes.STRING,
            allowNull: true
        })
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.deleteColumn('refresh', 'device_id'),
      await queryInterface.deleteColumn('refresh', 'fcm_token')
    }
}