import { sequelize } from "../../../utilities/db"
import { DataTypes, Model } from "sequelize"


class Months extends Model{}


Months.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'months',
    modelName: 'months'
})


export default Months