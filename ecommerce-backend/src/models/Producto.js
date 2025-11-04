import { DataTypes } from 'sequelize';

const defineProducto = (sequelize) => {
  const Producto = sequelize.define('Producto', {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaAlta:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    oferta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    cuitProveedor: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references:{
        model: 'proveedores',
        key: 'cuit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      references:{
        model: 'categorias',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    idUsuario: {  
      type: DataTypes.INTEGER,
      allowNull: false, // Producto siempre debe tener usuario
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT' // evita borrar un usuario con productos
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'productos',
    timestamps: false,
  });

  return Producto;
}

export default defineProducto;
