import { DataTypes } from "sequelize";
import { Usuario } from "./index.js";

const defineAdministrador = (sequelize) => {
  const Administrador = sequelize.define("Administrador", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
      unique: true, // Un usuario solo puede tener un registro en Administrador
    },
    
  }, {
    tableName: "administradores",
    timestamps: false,
  });

  return Administrador;
};

export default defineAdministrador;

