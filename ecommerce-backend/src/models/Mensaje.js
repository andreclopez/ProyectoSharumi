// models/Mensaje.js
import { DataTypes } from "sequelize";

const defineMensaje = (sequelize) => {
  const Mensaje = sequelize.define('Mensaje', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'mensajes',
    timestamps: false,
  });

  return Mensaje;
};

export default defineMensaje;
