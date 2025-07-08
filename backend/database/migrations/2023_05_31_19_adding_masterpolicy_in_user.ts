//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn('user', 'master_policy_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'master_policy', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.removeColumn('master_policy', 'master_policy_id')
    }
}