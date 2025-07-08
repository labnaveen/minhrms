import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";


class Announcement extends Model{};

Announcement.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    suspendable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    group_specific:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    start_date:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    // acceptable_announcement: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: false
    // },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    paranoid: true,
    tableName: 'announcement',
    modelName: 'announcement',
    deletedAt: 'deleted_at'
})

export default Announcement;