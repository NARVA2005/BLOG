import { DataTypes } from "sequelize";
import { sequelize } from "./baseDatos.js";
import { Usuarios } from "./usuarios.js";
import { Entradas } from "./entradas.js"
export const Comentarios = sequelize.define(
    "Comentarios",
    {
        idComentarios: {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement:true,
                    allowNull: false,
                },
                Contenido: {
                    type: DataTypes.STRING(150),
                    allowNull: false,
                },
                fechaComentario: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
              
                Usuarios_idUsuarios: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: Usuarios,
                        key: 'idUsuarios',
                      },
                },
                Entradas_idEntradas: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references:{
                        model:Entradas,
                        key:"idEntradas"
                    }
                },
             
    },
    {
        createdAt: false,
        updatedAt: false,
        tableName: "comentarios", // Nombre de la tabla en la base de datos
    }
);

