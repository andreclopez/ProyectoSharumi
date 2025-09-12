import { DataTypes } from 'sequelize';

const defineProveedor = (sequelize) => {
  const Proveedor = sequelize.define('Proveedor', {
    cuit: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idUsuario: { // FK al administrador/usuario
      type: DataTypes.INTEGER,
      allowNull: true, // permite crear proveedores sin admin asignado
      references: {
        model: 'usuarios', // o 'administradores' si querés apuntar solo a admin
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    tableName: 'proveedores',
    timestamps: false,
  });

  return Proveedor; 
};

export default defineProveedor;

