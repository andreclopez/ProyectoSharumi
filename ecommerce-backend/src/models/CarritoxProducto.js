import { DataTypes } from 'sequelize';

const defineCarritoxProducto = (sequelize) => {
  const CarritoxProducto = sequelize.define('CarritoxProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  idCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'carritosxProductos',
  timestamps: false,
});

return CarritoxProducto

};

export default defineCarritoxProducto;