import { CuponDescuento, Pedido } from '../models/index.js';

export const validarCuponPorCodigo = async (req, res) => {
  try {
    const { codigoCupon } = req.params;

    const cupon = await CuponDescuento.findOne({
      where: {
        codigoCupon: codigoCupon,
        activo: true
      }
    });
    if (!cupon) {
      return res.status(404).json({ mensaje: 'Cupón inválido o inactivo' });
    }
    res.status(200).json({
      nombreCupon: cupon.nombreCupon,
      porcentajeDescuento: cupon.porcentajeDescuento
    });
  } catch (error) {
    console.error('Error al validar cupón:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
}

export const obtenerCuponesActivos = async (req, res) => {
  try {
    const cupones = await CuponDescuento.findAll({
      where: { activo: true }
    });
    res.status(200).json(cupones);
  } catch (error) {
    console.error("Error al obtener los cupones:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerCuponPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cupon = await CuponDescuento.findByPk(id, {
      include: [
        {
          model: Pedido,
          as: 'pedidos',                
          attributes: ['id', 'total', 'estado', 'idUsuario', 'createdAt'] 
        }
      ]
    });

    if (!cupon) return res.status(404).json({ message: 'Cupón no encontrado' });

    res.status(200).json(cupon);
  } catch (error) {
    console.error("Error al obtener cupón por ID:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


export const crearCupon = async (req, res) => {
  try {
    const nuevoCupon = await CuponDescuento.create(req.body);
    res.status(201).json(nuevoCupon); 
  } catch (error) {
    console.error("Error al crear cupón:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarCupon = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const cupon = await CuponDescuento.findByPk(id);
    if (cupon) {
      const cuponActualizado = await cupon.update(datosActualizar);
      res.status(200).json(cuponActualizado);
    } else {
      res.status(404).json({ message: 'Cupón no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar cupón:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarCupon = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await CuponDescuento.destroy({
      where: { id: id }
    });
    
    if (resultado > 0) { 
      res.status(200).json({ message: 'Cupón eliminado exitosamente' }); 
    } else {
      res.status(404).json({ message: 'Cupón no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar el cupón:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }

};