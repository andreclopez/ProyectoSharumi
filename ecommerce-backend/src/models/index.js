import sequelize from "../db/connection.js";

import defineAdministrador from "./Administrador.js";
import defineCarrito from "./Carrito.js";
import defineCarritoxProducto from "./CarritoxProducto.js";
import defineCategoria from "./Categoria.js";
import defineCuponDescuento from "./CuponDescuento.js";
import definePago from "./Pago.js";
import definePedido from "./Pedido.js";
import definePedidoxProducto from "./PedidoxProducto.js";
import defineProducto from "./Producto.js";
import defineProveedor from "./Proveedor.js";
import defineUsuario from "./Usuario.js";
import defineMensaje from "./Mensaje.js";
import defineRol from "./Rol.js";

// Definición de modelos
const Usuario = defineUsuario(sequelize);
const Producto = defineProducto(sequelize);
const Proveedor = defineProveedor(sequelize);
const Administrador = defineAdministrador(sequelize);
const Rol = defineRol(sequelize);
const Carrito = defineCarrito(sequelize);
const CarritoxProducto = defineCarritoxProducto(sequelize);
const Categoria = defineCategoria(sequelize);
const CuponDescuento = defineCuponDescuento(sequelize);
const Pago = definePago(sequelize);
const Pedido = definePedido(sequelize);
const PedidoxProducto = definePedidoxProducto(sequelize);
const Mensaje = defineMensaje(sequelize);

// Relaciones

// Roles ↔ Usuarios
Usuario.belongsTo(Rol, { foreignKey: 'idRol', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'idRol', as: 'usuarios' });

// Administrador ↔ Usuario
Administrador.belongsTo(Usuario, { foreignKey: { name: "idUsuario", allowNull: true }, as: "usuario" });
Usuario.hasOne(Administrador, { foreignKey: { name: "idUsuario", allowNull: true }, as: "administrador" });

// Administrador ↔ Proveedor
Administrador.hasMany(Proveedor, { foreignKey: 'idAdministrador', as: 'proveedores' });
Proveedor.belongsTo(Administrador, { foreignKey: 'idAdministrador', as: 'administrador' });

// Administrador ↔ Producto
Administrador.hasMany(Producto, { foreignKey: 'idAdministrador', as: 'productosAdmin' });
Producto.belongsTo(Administrador, { foreignKey: 'idAdministrador', as: 'administrador' });

// Usuario ↔ Producto
Usuario.hasMany(Producto, { foreignKey: 'idUsuario', as: 'productos' });
Producto.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

// Usuario ↔ Carrito
Usuario.hasMany(Carrito, { foreignKey: 'idUsuario', as: 'carritos' });
Carrito.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

// Usuario ↔ Pedido
Usuario.hasMany(Pedido, { foreignKey: 'idUsuario', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

// Proveedor ↔ Producto
Proveedor.hasMany(Producto, { foreignKey: 'cuitProveedor', as: 'productos' });
Producto.belongsTo(Proveedor, { foreignKey: 'cuitProveedor', as: 'proveedor' });

// Categoría ↔ Producto
Categoria.hasMany(Producto, { foreignKey: 'idCategoria', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoria' });

// Producto ↔ Mensaje
Producto.hasMany(Mensaje, { foreignKey: 'idProducto', as: 'mensajes' });
Mensaje.belongsTo(Producto, { foreignKey: 'idProducto', as: 'producto' });

// Carrito ↔ Producto (muchos a muchos)
Carrito.belongsToMany(Producto, { through: 'CarritoxProducto', foreignKey: 'idCarrito', as: 'productos' });
Producto.belongsToMany(Carrito, { through: 'CarritoxProducto', foreignKey: 'idProducto', as: 'carritos' });

// CarritoxProducto ↔ Carrito & Producto
CarritoxProducto.belongsTo(Carrito, { foreignKey: 'idCarrito', as: 'carrito' });
Carrito.hasMany(CarritoxProducto, { foreignKey: 'idCarrito', as: 'carritoxproductos', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

CarritoxProducto.belongsTo(Producto, { foreignKey: 'idProducto', as: 'producto' });
Producto.hasMany(CarritoxProducto, { foreignKey: 'idProducto', as: 'carritoxproductos' });

// Pedido ↔ PedidoxProducto
Pedido.hasMany(PedidoxProducto, { foreignKey: 'idPedido', as: 'pedidoxproductos' });
PedidoxProducto.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedido' });

Producto.hasMany(PedidoxProducto, { foreignKey: 'idProducto', as: 'pedidoxproductos' });
PedidoxProducto.belongsTo(Producto, { foreignKey: 'idProducto', as: 'producto' });

// CuponDescuento ↔ Pedido
CuponDescuento.hasMany(Pedido, { foreignKey: 'idCuponDescuento', as: 'pedidos' });
Pedido.belongsTo(CuponDescuento, { foreignKey: 'idCuponDescuento', as: 'cupon' });

// Pedido ↔ Pago
Pedido.hasOne(Pago, { foreignKey: 'idPedido', as: 'pago' });
Pago.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedido' });

export {
  sequelize,
  Usuario,
  Administrador,
  Producto,
  Proveedor,
  Rol,
  Carrito,
  CarritoxProducto,
  Categoria,
  CuponDescuento,
  Pago,
  Pedido,
  PedidoxProducto,
  Mensaje,
};
