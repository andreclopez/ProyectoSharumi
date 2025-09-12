import { Pago, Pedido } from '../models/index.js';

export const obtenerPagosActivos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.status(200).json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos activos:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id, {
      include: [
        {
          model: Pedido,
          as: 'pedido', // 👈 alias definido en la asociación
          attributes: ['id', 'total', 'estado', 'idUsuario']
        }
      ]
    });

    if (pago) {
      res.status(200).json(pago);
    } else {
      res.status(404).json({ message: 'Pago no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener pago por ID:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const crearPago = async (req, res) => {
  try {
    const nuevoPago = await Pago.create(req.body);
    res.status(201).json(nuevoPago); 
  } catch (error) {
    console.error("Error al crear pago:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    const pago = await Pago.findByPk(id);

    if (pago) {
      const pagoActualizado = await pago.update(datosActualizar);
      res.status(200).json(pagoActualizado);
    } else {
      res.status(404).json({ message: 'Pago no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Pago.destroy({
      where: { id }
    });

    if (resultado > 0) {
      res.status(200).json({ message: 'Pago eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Pago no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar pago:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
