import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

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
    },
    // campos para login social
    proveedor: {
      type: DataTypes.STRING, // indica cómo se registró el usuario (local, google, facebook).
      allowNull: false,
      defaultValue: "local",
    },
    proveedorId: {
      type: DataTypes.STRING, // id que da Google/Facebook guarda el id que devuelve el proveedor
      allowNull: true,
    },
  }, {
    tableName: 'usuarios',
    timestamps: true,
  });

  // Para encriptar la contraseña antes de crearla

  Usuario.beforeCreate(async (usuario) => {
    if (usuario.password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(usuario.password, salt);
    }
  });

  // Encriptar si se actualiza contraseña

  Usuario.beforeUpdate(async (usuario) =>{
    if (usuario.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(usuario.password, salt);
    }
  });

  // Método de instancia para validar la contraseña
  Usuario.prototype.validarPassword = async function (passwordPlano) {
    return await bcrypt.compare(passwordPlano, this.password);
  }

  return Usuario; 
};

export default defineUsuario;
