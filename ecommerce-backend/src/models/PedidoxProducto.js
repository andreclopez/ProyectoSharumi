import { DataTypes } from 'sequelize';

const definePedidoxProducto = (sequelize) => {
  const PedidoxProducto = sequelize.define('PedidoxProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'pedidosxProductos',
  timestamps: false,
});

return PedidoxProducto

};

export default definePedidoxProducto;