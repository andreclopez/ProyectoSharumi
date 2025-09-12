import { DataTypes } from 'sequelize';

const definePedido = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'cerrado', 'cancelado'), 
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Usuario que realizo la compra'
  },
  idCuponDescuento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cupones',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', 
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
});

return Pedido

};

export default definePedido;