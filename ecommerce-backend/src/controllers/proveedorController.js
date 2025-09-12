import { Proveedor, Producto, Administrador } from '../models/index.js';

export const obtenerProveedoresActivos = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const obtenerProveedorPorCuit = async (req, res) => {
  try {
    const { cuit } = req.params;
    const proveedor = await Proveedor.findByPk(cuit, {
      include: [
        {
          model: Producto,
          as: 'productos', 
          attributes: ['id', 'nombre', 'precio']
        },
        {
          model: Administrador,
          as: 'administrador', 
          attributes: ['id', 'idUsuario']
        }
      ]
    });

    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

    res.status(200).json(proveedor);
  } catch (error) {
    console.error("Error al obtener proveedor por cuit:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = await Proveedor.create(req.body);
    res.status(201).json(nuevoProveedor); 
  } catch (error) {
    console.error("Error al crear el proveedor:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const actualizarProveedor = async (req, res) => {
  try {
    const { cuit } = req.params;
    const datosActualizar = req.body;
    const proveedor = await Proveedor.findByPk(cuit);
    if (proveedor) {
      const proveedorActualizado = await proveedor.update(datosActualizar);
      res.status(200).json(proveedorActualizado);
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado para actualizar' });
    }
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const eliminarProveedor = async (req, res) => {
  try {
    const { cuit } = req.params;
    const resultado = await Proveedor.destroy({
      where: { cuit: cuit }
    });
    
    if (resultado > 0) { 
      res.status(200).json({ message: 'Proveedor eliminado exitosamente' }); 
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado para eliminar' });
    }
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
