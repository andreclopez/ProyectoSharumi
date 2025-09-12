import { PedidoxProducto, Producto, Pedido } from '../models/index.js';

// Obtener todos los PedidosxProductos activos
export const obtenerPedidosxProductosActivos = async (req, res) => {
  try {
    const pedidosxProductos = await PedidoxProducto.findAll({
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id', 'nombre', 'precio']
        },
        {
          model: Pedido,
          as: 'pedido',
          attributes: ['id', 'estado']
        }
      ],
      order: [['id', 'DESC']]
    });

    res.status(200).json({ success: true, data: pedidosxProductos });

  } catch (error) {
    console.error("Error al obtener PedidosxProductos:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener PedidoxProducto por ID
export const obtenerPedidoxProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pedidoxProducto = await PedidoxProducto.findByPk(id, {
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id', 'nombre', 'precio']
        },
        {
          model: Pedido,
          as: 'pedido',
          attributes: ['id', 'estado']
        }
      ]
    });

    if (!pedidoxProducto) {
      return res.status(404).json({ success: false, message: 'Datos no encontrados' });
    }

    res.status(200).json({ success: true, data: pedidoxProducto });

  } catch (error) {
    console.error("Error al obtener PedidoxProducto por ID:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Crear nuevo PedidoxProducto
export const crearPedidoxProducto = async (req, res) => {
  try {
    const { cantidad, idPedido, idProducto } = req.body;

    const producto = await Producto.findByPk(idProducto);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

    const pedido = await Pedido.findByPk(idPedido);
    if (!pedido) return res.status(404).json({ success: false, message: "Pedido no encontrado" });

    const precioUnitario = producto.precio;
    const subtotal = cantidad * precioUnitario;

    const nuevoPedidoxProducto = await PedidoxProducto.create({
      cantidad,
      precioUnitario,
      subtotal,
      idPedido,
      idProducto
    });

    res.status(201).json({ success: true, data: nuevoPedidoxProducto });

  } catch (error) {
    console.error("Error al crear PedidoxProducto:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Actualizar PedidoxProducto
export const actualizarPedidoxProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidoxProducto = await PedidoxProducto.findByPk(id);

    if (!pedidoxProducto) {
      return res.status(404).json({ success: false, message: 'Datos no encontrados para actualizar' });
    }

    const pedidoxProductoActualizado = await pedidoxProducto.update(req.body);
    res.status(200).json({ success: true, data: pedidoxProductoActualizado });

  } catch (error) {
    console.error("Error al actualizar PedidoxProducto:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar PedidoxProducto
export const eliminarPedidoxProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await PedidoxProducto.destroy({ where: { id } });

    if (resultado === 0) {
      return res.status(404).json({ success: false, message: 'Datos no encontrados para eliminar' });
    }

    res.status(200).json({ success: true, message: 'Datos eliminados exitosamente' });

  } catch (error) {
    console.error("Error al eliminar PedidoxProducto:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};
