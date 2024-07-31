import { DataTypes } from "sequelize";
import { sequelize } from "./baseDatos.js";

export const Usuarios = sequelize.define(
  "Usuarios",
  {
    idUsuarios: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    identificacion: {
      type: DataTypes.STRING,
      allowNull: false,
      msg: "Identificacion registrada"
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      defaultValue: 'activo',
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false,
    }
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Usuarios.associate = (models) => {
  Usuarios.hasMany(models.Comentarios, { foreignKey: 'Usuarios_idUsuarios' });
};
