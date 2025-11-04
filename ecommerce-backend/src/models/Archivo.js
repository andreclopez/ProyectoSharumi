import { DataTypes } from "sequelize";
import { Producto, Categoria } from "./index.js";

const defineArchivo = (sequelize) => {
    const Archivo = sequelize.define('Archivo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notNull: {
                msg: "El nombre del archivo es obligatorio"
            },
            notEmpty: {
                msg: "El nombre del archivo no puede estar vacío"
            },
            len: {
                args: [1, 255],
                msg: "El nombre del archivo debe tener entre 1 y 255 caracteres"
            },
            is: {
                args: /^[a-zA-Z0-9_\-\.]+$/,
                msg: "El nombre del archivo solo puede contener letras, números, guiones, puntos y guiones bajos"
            }
          }
        },
        nombreOriginal: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notNull: {
                msg: "El nombre original del archivo es obligatorio"
            },
            notEmpty: {
                msg: "El nombre original del archivo no puede estar vacío"
            },
            len: {
                args: [1, 255],
                msg: "El nombre original debe tener entre 1 y 255 caracteres"
            }
          }
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notNull: {
                msg: "El tipo de archivo es obligatorio"
            },
            notEmpty: {
                msg: "El tipo de archivo no puede estar vacío"
            },
            isIn: {
                args: [['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']],
                msg: "Tipo de archivo no permitido"
            }
          }
        },
        peso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
            notNull: {
                msg: "El peso del archivo es obligatorio"
            },
            isFloat: {
                msg: "El peso debe ser un número válido"
            },
            min: {
                args: [0.001],
                msg: "El peso del archivo debe ser mayor a 0"
            },
            max: {
                args: [10485760], // El valor 10485760 son 10 Megabytes (10 * 1024 * 1024 bytes)
                msg: "El archivo no puede pesar más de 10MB"
            }
          }
        },
        ruta: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notNull: {
                msg: "La ruta del archivo es obligatoria"
            },
            notEmpty: {
                msg: "La ruta del archivo no puede estar vacía"
            },
            len: {
                args: [1, 500],
                msg: "La ruta debe tener entre 1 y 500 caracteres"
            },
            is: {
                args: /^[a-zA-Z0-9_\-\.\/\\]+$/,
                msg: "La ruta contiene caracteres no permitidos"
            }
          }
        },
        idProducto: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: Producto, key: "id" },
            validate: {
                isInt: { msg: "El ID del producto debe ser un número entero" },
                min: { args: [1], msg: "El ID del producto debe ser mayor a 0" },
                async exists(value) {
                if (value === null || value === undefined) return; 
                const producto = await Producto.findByPk(value);
                if (!producto) throw new Error('El producto especificado no existe');
            }
          }
        },
        idCategoria: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: Categoria, key: "id" },
            validate: {
                isInt: { msg: "El ID de la categoría debe ser un número entero" },
                min: { args: [1], msg: "El ID de la categoría debe ser mayor a 0" },
                async exists(value) {
                if (value === null || value === undefined) return; 
                const categoria = await Categoria.findByPk(value);
                if (!categoria) throw new Error('La categoria especificada no existe');
            }
          }
        }

    }, {
        tableName: 'archivos',
        timestamps: true,
        createdAt: 'fechaSubida',
        updatedAt: false,
        hooks: {
            beforeValidate: (archivo) => {
            // Limpiar y normalizar datos antes de validar
            if (archivo.nombre) {
                archivo.nombre = archivo.nombre.trim();
            }
            if (archivo.nombreOriginal) {
                archivo.nombreOriginal = archivo.nombreOriginal.trim();
            }
            if (archivo.ruta) {
                archivo.ruta = archivo.ruta.trim().replace(/\\/g, '/');
            }

            // Asegurar que el peso sea un número
            if (archivo.peso && typeof archivo.peso === 'string') {
                archivo.peso = parseFloat(archivo.peso);
            }
          }
        }
    });

    return Archivo
};

export default defineArchivo