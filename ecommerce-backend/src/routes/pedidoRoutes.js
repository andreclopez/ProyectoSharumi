import express from 'express';
import { 
    obtenerPedidos, 
    obtenerPedidoPorId, 
    crearPedido, 
    actualizarPedido, 
    eliminarPedido 
} from '../controllers/pedidoController.js';

const router = express.Router();

// Listar pedidos
router.get('/', obtenerPedidos);

// Obtener pedido por ID
router.get('/:id', obtenerPedidoPorId);

// Crear pedido
router.post('/', async (req, res) => {
  try {
    await crearPedido(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear pedido', detalle: error.message });
  }
});

// Actualizar pedido
router.put('/:id', async (req, res) => {
  try {
    await actualizarPedido(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar pedido', detalle: error.message });
  }
});

// Eliminar pedido
router.delete('/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;

    const tieneProductos = await req.db.PedidoXProducto.count({ where: { idPedido: pedidoId } });

    if (tieneProductos) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar el pedido porque tiene productos asociados'
      });
    }

    await eliminarPedido(req, res);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar pedido', detalle: error.message });
  }
});

export default router;
