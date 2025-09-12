import { Pedido, Usuario, CuponDescuento, PedidoxProducto, Producto } from '../models/index.js';
import { validationResult } from 'express-validator';

// Obtener todos los pedidos activos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { estado: 'activo' },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { model: CuponDescuento, as: 'cupon', attributes: ['id', 'codigoCupon', 'porcentajeDescuento'] },
        {
          model: PedidoxProducto,
          as: 'pedidoxproductos',
          attributes: ['id', 'cantidad', 'precioUnitario', 'subtotal'],
          include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }]
        }
      ],
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Pedidos activos obtenidos correctamente',
      data: pedidos
    });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { model: CuponDescuento, as: 'cupon', attributes: ['id', 'codigoCupon', 'porcentajeDescuento'] },
        {
          model: PedidoxProducto,
          as: 'pedidoxproductos',
          attributes: ['id', 'cantidad', 'precioUnitario', 'subtotal'],
          include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }]
        }
      ]
    });

    if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });

    res.status(200).json({ success: true, message: 'Pedido encontrado', data: pedido });
  } catch (error) {
    console.error('Error al obtener pedido por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Crear pedido
export const crearPedido = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errors.array() });
    }

    const { idUsuario, idCuponDescuento, estado, total, productos } = req.body;

    // Validar usuario
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    // Crear pedido
    const nuevoPedido = await Pedido.create({
      idUsuario,
      idCuponDescuento: idCuponDescuento || null,
      estado: estado || 'activo',
      total
    });

    // Crear registros en PedidoxProducto
    if (productos && productos.length) {
      const pedidoxProductosData = productos.map(p => ({
        idPedido: nuevoPedido.id,
        idProducto: p.idProducto,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario || 0,
        subtotal: (p.precioUnitario || 0) * p.cantidad
      }));
      await PedidoxProducto.bulkCreate(pedidoxProductosData);
    }

    // Traer pedido completo con relaciones
    const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { model: CuponDescuento, as: 'cupon', attributes: ['id', 'codigoCupon', 'porcentajeDescuento'] },
        {
          model: PedidoxProducto,
          as: 'pedidoxproductos',
          attributes: ['id', 'cantidad', 'precioUnitario', 'subtotal'],
          include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }]
        }
      ]
    });

    res.status(201).json({ success: true, message: 'Pedido creado exitosamente', data: pedidoCompleto });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Actualizar pedido
export const actualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado para actualizar' });

    await pedido.update(req.body);

    const pedidoCompleto = await Pedido.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { model: CuponDescuento, as: 'cupon', attributes: ['id', 'codigoCupon', 'porcentajeDescuento'] },
        {
          model: PedidoxProducto,
          as: 'pedidoxproductos',
          attributes: ['id', 'cantidad', 'precioUnitario', 'subtotal'],
          include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] }]
        }
      ]
    });

    res.status(200).json({ success: true, message: 'Pedido actualizado exitosamente', data: pedidoCompleto });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Pedido.destroy({ where: { id } });
    if (!resultado) return res.status(404).json({ success: false, message: 'Pedido no encontrado para eliminar' });

    res.status(200).json({ success: true, message: 'Pedido eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};
