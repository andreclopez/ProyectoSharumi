// src/models/Categoria.js
import { DataTypes } from 'sequelize';

const defineCategoria = (sequelize) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'categorias',
    timestamps: false,
  });

  return Categoria; 
};

export default defineCategoria;
