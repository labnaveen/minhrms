import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import moment from "moment";




class PasswordRecovery extends Model{}


PasswordRecovery.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: true
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sent_at:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    expires_at:{
        type: DataTypes.DATE,
        allowNull: false
    },
    isExpired: {
        type: DataTypes.VIRTUAL,
        get(){
            if(!this.get('expires_at')){
                return true
            }
            //@ts-ignore
            if(moment().toDate() > moment(this.get('expires_at')).toDate()){
                return true
            }
            return false
        }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'password_recovery',
    modelName: 'password_recovery'
})

export default PasswordRecovery;