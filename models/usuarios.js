import { DataTypes } from "sequelize";
import { sequelize } from "./baseDatos.js";

export const Usuarios=sequelize.define(
    "Usuarios",
    {
        idUsuarios:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false 
        },
        identificacion:{
            type:DataTypes.STRING,
            allowNull:false,
            msg:"Identificacion registrada"

        },
        nombre:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            isEmail:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        estado:{
            type:DataTypes.STRING,
            allowNull:false
        }
     
    },
    {
        createdAt: false,
        updatedAt: false,
    }
)
