import { DataTypes } from "sequelize";

const defineCuponDescuento = (sequelize) => {
  const CuponDescuento = sequelize.define('CuponDescuento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombreCupon: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre descriptivo'
  },
  codigoCupon: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Codigo que ingresará el cliente'
  },
  porcentajeDescuento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Porcentaje de descuento que se aplicará',
    validate: {
      min: 0,
      max: 100,
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Indica si el cupón puede ser utilizado'
  },
}, {
  tableName: 'cupones',
  timestamps: false,
});

return CuponDescuento;

}

export default defineCuponDescuento;