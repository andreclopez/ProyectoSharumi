import { Mensaje, Producto } from '../models/index.js';

// ------------------------
// Obtener todos los mensajes (sin filtro)
// ------------------------
export const obtenerTodosLosMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.findAll();
    return res.status(200).json({
      success: true,
      data: mensajes
    });
  } catch (error) {
    console.error('Error al obtener todos los mensajes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al obtener mensajes',
      error: error.message
    });
  }
};

// ------------------------
// Obtener mensajes de un producto
// ------------------------
export const obtenerMensajePorProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;

    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'El producto no existe'
      });
    }

    const mensajes = await Mensaje.findAll({ where: { idProducto } });

    if (mensajes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron mensajes para este producto'
      });
    }

    return res.status(200).json({
      success: true,
      data: mensajes
    });
  } catch (error) {
    console.error('Error al obtener mensajes por producto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al obtener mensajes',
      error: error.message
    });
  }
};

// ------------------------
// Obtener mensaje por ID
// ------------------------
export const obtenerMensajePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await Mensaje.findByPk(id);

    if (!mensaje) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: mensaje
    });
  } catch (error) {
    console.error('Error al obtener mensaje por ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al obtener mensaje',
      error: error.message
    });
  }
};

// ------------------------
// Crear mensaje
// ------------------------
export const crearMensaje = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const { texto } = req.body;

    // Validación de seguridad: verificar producto
    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'El producto no existe'
      });
    }

    // Crear el mensaje
    const nuevoMensaje = await Mensaje.create({ texto, idProducto });

    return res.status(201).json({
      success: true,
      message: 'Mensaje creado exitosamente',
      data: nuevoMensaje
    });
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al crear mensaje',
      error: error.message
    });
  }
};

// ------------------------
// Actualizar mensaje
// ------------------------
export const actualizarMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    const mensaje = await Mensaje.findByPk(id);
    if (!mensaje) {
      return res.status(404).json({
        success: false,
        message: 'El mensaje no existe'
      });
    }

    if (!texto || texto.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El texto no puede estar vacío'
      });
    }

    mensaje.texto = texto;
    await mensaje.save();

    return res.status(200).json({
      success: true,
      message: 'Mensaje actualizado exitosamente',
      data: mensaje
    });
  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar mensaje',
      error: error.message
    });
  }
};

// ------------------------
// Eliminar mensaje
// ------------------------
export const eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Mensaje.destroy({ where: { id } });

    if (resultado === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado para eliminar'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mensaje eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al eliminar mensaje',
      error: error.message
    });
  }
};
