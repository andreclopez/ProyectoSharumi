import { DataTypes } from 'sequelize';

const defineCarrito = (sequelize) => {
  const Carrito = sequelize.define('Carrito', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaAlta: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'cerrado', 'cancelado'), 
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'carritos',
    timestamps: true,
  });

  return Carrito; 
};

export default defineCarrito;
