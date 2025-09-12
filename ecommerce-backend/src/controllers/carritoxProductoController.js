import { CarritoxProducto, Carrito, Producto, } from '../models/index.js';

export const obtenerCarritosxProductosActivos = async (req, res) => {
  try {
    const carritosxProductos = await CarritoxProducto.findAll();
    res.status(200).json(carritosxProductos);
  } catch (error) {
    console.error("Error al obtener información:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerCarritoxProductoPorId = async (req, res) => {
  try {
    const carritoxProductos = await CarritoxProducto.findAll({
      include: [
        {
          model: Producto,
          as: 'producto', 
          attributes: ['id', 'nombre']
        },
        {
          model: Carrito,
          as: 'carrito', 
          attributes: ['id']
        }
      ]
    });

    res.status(200).json(carritoxProductos);
  } catch (error) {
    console.error("Error al obtener carritosxproductos:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const crearCarritoxProducto = async (req, res) => {
  try {
    const { cantidad, idCarrito, idProducto } = req.body;

    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({ message: "Datos no encontrados" });
    }

    const subtotal = cantidad * producto.precio;

    const nuevoRegistro = await CarritoxProducto.create({
      cantidad,
      subtotal,
      idCarrito,
      idProducto
    });

    res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarCarritoxProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const carritoxProducto = await CarritoxProducto.findByPk(id);
    if (carritoxProducto) {
      const carritoxProductoActualizado = await carritoxProducto.update(datosActualizar);
      res.status(200).json(carritoxProductoActualizado);
    } else {
      res.status(404).json({ message: 'Datos no encontrados para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar la información:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarCarritoxProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await CarritoxProducto.destroy({
      where: { id: id }
    });
    
    if (resultado > 0) { 
      res.status(200).json({ message: 'Datos eliminados exitosamente' }); 
    } else {
      res.status(404).json({ message: 'Datos no encontrados para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar datos:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
