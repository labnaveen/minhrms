//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn('asset', 'user_id', {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'user', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.removeColumn('asset', 'user_id')
    }
}