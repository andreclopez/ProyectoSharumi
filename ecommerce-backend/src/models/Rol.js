import { DataTypes } from "sequelize";

const defineRol = (sequelize) => {
    const Rol = sequelize.define('Rol', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        codigo: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        descripcion: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    }, {
        tableName: 'roles',
        timestamps: true,
  });

  return Rol;
    
};

export default defineRol;