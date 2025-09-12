import { DataTypes } from 'sequelize';

const defineUsuario = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: { 
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    localidad: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigoPostal: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles', 
        key: 'id'
      },
       onUpdate: 'CASCADE',
       onDelete: 'RESTRICT',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
  });

  return Usuario; 
};

export default defineUsuario;
