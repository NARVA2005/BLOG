import { DataTypes } from "sequelize";
import { sequelize } from "./baseDatos.js";

export const Entradas = sequelize.define(
    "Entradas",
    {
                idEntradas: {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement:true,
                    allowNull: false,
                },
                Titulos: {
                    type: DataTypes.STRING(300),
                    allowNull: false,
                },
                Contenido: {
                    type: DataTypes.STRING(300),
                    allowNull: false,
                },
              
                fechaPublicacion: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                
                },
                imagen: {
                    type: DataTypes.STRING(300),
                    allowNull: false,
                },
                estado:{
                    type:DataTypes.STRING(300),
                    allowNull:false,
                }
             
    },
    {
        createdAt: false,
        updatedAt: false,
        tableName: "entradas", // Nombre de la tabla en la base de datos
    }
);

