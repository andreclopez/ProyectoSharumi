import { DataTypes } from 'sequelize';

const definePago = (sequelize) => {
  const Pago = sequelize.define('Pago', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    metodoPago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estadoPago: {
      type: DataTypes.ENUM('pendiente', 'completado', 'fallido'),
      allowNull: false,
    },
    idPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'pagos',
    timestamps: false,
  });

  return Pago; 
};

export default definePago;
