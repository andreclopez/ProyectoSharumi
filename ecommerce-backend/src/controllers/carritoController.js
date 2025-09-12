import { Carrito, Producto, Usuario} from '../models/index.js';

export const obtenerCarritosActivos = async (req, res) => {
  try {
    const carritos = await Carrito.findAll({
      where: { estado: 'activo' }
    });
    res.status(200).json(carritos);
  } catch (error) {
    console.error("Error al obtener los carritos activos:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerCarritoPorId = async (req, res) => { 
  try {
    const { id } = req.params;
    const carrito = await Carrito.findByPk(id, { 
      include: [
        {
          model: Producto, 
          as: 'productos', 
          attributes: ['id', 'nombre'],
          through: { attributes: ['cantidad'] } 
        }, 
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (carrito) {
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener carrito por ID:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


export const crearCarrito = async (req, res) => {
  try {
    const { idUsuario, estado, fechaAlta } = req.body;

    // Validar que exista el usuario
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear carrito con fechaAlta por defecto si no viene
    const nuevoCarrito = await Carrito.create({
      idUsuario,
      estado: estado || 'activo',
      fechaAlta: fechaAlta || new Date()
    });

    res.status(201).json(nuevoCarrito);

  } catch (error) {
    console.error("Error al crear carrito:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const carrito = await Carrito.findByPk(id);
    if (carrito) {
      const carritoActualizado = await carrito.update(datosActualizar);
      res.status(200).json(carritoActualizado);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Carrito.destroy({
      where: { id: req.params.id }
    });
    
    if (resultado > 0) { 
      res.status(200).json({ message: 'Carrito eliminado exitosamente' }); 
    } else {
      res.status(404).json({ message: 'Carrito no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar carrito:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
