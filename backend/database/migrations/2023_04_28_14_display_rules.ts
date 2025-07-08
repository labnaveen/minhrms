//@ts-nocheck
import { DataTypes  } from "sequelize";



module.exports ={
    up: async({context: queryInterface})=>{
        await queryInterface.createTable('display_rules', {
            id:{
                type: DataTypes.INTEGER,
                primarykey: true,
                unique: true,
                autoIncrement: true
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_deleted:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at:{
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at:{
                type: DataTypes.DATE,
                allowNull: false
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('display_rules')
    }
}