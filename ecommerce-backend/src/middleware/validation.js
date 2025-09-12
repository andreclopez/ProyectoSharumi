import { body, param, query } from 'express-validator';
import { Categoria, Rol, Producto, Pedido, Carrito } from "../models/index.js"
import *as db from '../models/index.js';

const { Usuario } = db;
// Validaciones generales

// Validación genérica de ID en params
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo')
];

// Validaciones de paginación (query)
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
];

// Validaciones para productos

// Validaciones para FKs de productos
export const validateProductoFK = [
  body('idUsuario')
    .notEmpty().withMessage('El idUsuario es requerido')
    .isInt({ min: 1 }).withMessage('El idUsuario debe ser un número entero positivo')
    .custom(async (value) => {
      const usuario = await Usuario.findByPk(value);
      if (!usuario) throw new Error('El idUsuario no existe');
    }),

  body('idCategoria')
    .optional({ nullable: true }) // ahora sí acepta null
    .isInt({ min: 1 }).withMessage('El idCategoria debe ser un número entero positivo')
    .custom(async (value) => {
      if (value) {
        const categoria = await Categoria.findByPk(value);
        if (!categoria) throw new Error('La categoría no existe');
      }
    })
];

// Validaciones para creación de productos
export const validateProductoCreate = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }),
  body('precio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  body('imagenUrl')
    .notEmpty().withMessage('La imagen es requerida')
    .isURL().withMessage('Debe ser una URL válida'),
  body('rating') //opcional
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 5 }).withMessage('El rating debe estar entre 0 y 5'),
  body('fechaAlta')  // Fecha opcional, Sequelize la pone por defecto
    .optional({ nullable: true })
    .isISO8601().withMessage('Debe ser una fecha válida'),
  body('idUsuario')
    .notEmpty().withMessage('El idUsuario es requerido')
    .isInt({ min: 1 }),
  body('idCategoria') //opcional
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('El idCategoria debe ser un número entero positivo')
];

// Validaciones para actualización de productos
export const validateProductoUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('precio')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('idCategoria')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('El idCategoria debe ser un número entero positivo'),
  body('descripcion')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  body('rating')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 5 }).withMessage('El rating debe estar entre 0 y 5'),
  body('fechaAlta')
    .optional({ nullable: true })
    .isISO8601().withMessage('Debe ser una fecha válida')
];

// Validación de ID de producto
export const validateProductoId = validateId;

// Validación Pedido
export const validatePedidoCreate = [
  body('idUsuario')
    .notEmpty().withMessage('El idUsuario es requerido')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),
  body('productos')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('productos.*.idProducto')
    .notEmpty().withMessage('El idProducto es requerido')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),
  body('productos.*.cantidad')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo')
]

// Validación de Pago
export const validatePagoCreate = [
  body("idPedido")
    .notEmpty().withMessage("El idPedido es requerido")
    .isInt({ min: 1 }).withMessage("El idPedido debe ser un número entero positivo")
    .custom(async (value) => {
      const pedido = await Pedido.findByPk(value);
      if (!pedido) throw new Error("El idPedido no existe en la base de datos");
    }),
  body("metodoPago") // ✅ corregido para coincidir con tu modelo/ruta
    .notEmpty().withMessage("El método de pago es requerido")
    .isString().withMessage("El método debe ser texto")
    .isLength({ max: 50 }).withMessage("El método de pago no puede exceder 50 caracteres"),
  body("monto")
    .notEmpty().withMessage("El monto es requerido")
    .isFloat({ min: 0.01 }).withMessage("El monto debe ser mayor a 0"),
  body("estado")
    .optional()
    .isIn(["pendiente", "completado", "cancelado"])
    .withMessage("Estado inválido"),
];

// Validación de mensaje
export const validateMensajeCreate = [
  param('idProducto')
    .notEmpty().withMessage('El idProducto es obligatorio')
    .isInt({ min: 1 }).withMessage('El idProducto debe ser un número entero positivo')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) throw new Error('El idProducto no existe');
    }),
  body('texto')
    .notEmpty().withMessage('El contenido del mensaje es obligatorio')
    .isLength({ min: 2 }).withMessage('El contenido debe tener al menos 2 caracteres')
];

// Validación Carrito
export const validateCarritoCreate = [
  body('idUsuario')
    .notEmpty().withMessage('El idUsuario es requerido')
    .isInt({ min: 1 }).withMessage('El idUsuario debe ser un número entero positivo')
    .custom(async (value) => {
      const usuario = await Usuario.findByPk(value);
      if (!usuario) throw new Error('El idUsuario no existe');
    })
];

// Validación para creación de pedidosxProductos
export const validatePedidoxProductoCreate = [
  body("idPedido")
    .notEmpty().withMessage("El idPedido es requerido")
    .isInt({ min: 1 }).withMessage("El idPedido debe ser un número entero positivo")
    .custom(async (value) => {
      const pedido = await Pedido.findByPk(value);
      if (!pedido) throw new Error("El idPedido no existe");
    }),
  body("idProducto")
    .notEmpty().withMessage("El idProducto es requerido")
    .isInt({ min: 1 }).withMessage("El idProducto debe ser un número entero positivo")
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) throw new Error("El idProducto no existe");
    }),
  body("cantidad")
    .notEmpty().withMessage("La cantidad es requerida")
    .isInt({ min: 1 }).withMessage("Debe ser un número entero positivo"),
  body("precioUnitario")
    .notEmpty().withMessage("El precio unitario es requerido")
    .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
  body("subtotal")
    .notEmpty().withMessage("El subtotal es requerido")
    .isFloat({ min: 0 }).withMessage("El subtotal debe ser un número mayor o igual a 0"),
];

//Validaciones para carritoxProducto

export const validateCarritoXProductoCreate = [
  body('idProducto')
    .notEmpty().withMessage('El idProducto es requerido')
    .isInt({ min: 1 }).withMessage('idProducto debe ser un número entero positivo')
    .custom(async (value) => {
      const producto = await Producto.findByPk(value);
      if (!producto) throw new Error('El producto no existe');
    }),
  body('idCarrito')
    .notEmpty().withMessage('El idCarrito es requerido')
    .isInt({ min: 1 }).withMessage('idCarrito debe ser un número entero positivo')
    .custom(async (value) => {
      const carrito = await Carrito.findByPk(value);
      if (!carrito) throw new Error('El carrito no existe');
    }),
  body('cantidad')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo')
];

// Validaciones para usuarios
export const validateUsuarioCreate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Debe ser un email válido'),
  body('idRol')
    .optional()
    .isInt({ min:1 }).withMessage('El rol debe ser un número entero positivo')
    .custom(async (value) => {
      const rol = await Rol.findByPk(value);
      if (!rol) throw new Error('El rol no existe');
    })
];

