import { useState, useEffect } from 'react';
import productoService from '../../services/productoService.js';
import Cargando from '../../components/generales/Cargando.jsx';
import Error from '../../components/generales/Error.jsx';

/**
 * Dashboard básico para Admin
 * Muestra todos los productos en una tabla
 * con acciones de edición y eliminación
 */
const DashboardAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        const respuesta = await productoService.obtenerProductos();
        setProductos(respuesta.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div className="w-full min-h-screen p-6" style={{ backgroundColor: '#fdf6f0' }}>
      <h2 
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: '#a0522d' }}
      >
        Gestión de Productos
      </h2>

      {cargando && <Cargando mensaje="Cargando productos..." />}
      {error && <Error mensaje={error} />}

      {!cargando && !error && (
        <table className="w-full text-left border-collapse bg-white rounded shadow-md">
          <thead className="bg-[#5a2a2a] text-[#fdf6f0]">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Imagen</th>
              <th className="py-2 px-4">Precio</th>
              <th className="py-2 px-4">Stock</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((prod) => (
                <tr key={prod.id} className="border-b border-gray-300">
                  <td className="py-2 px-4">{prod.id}</td>
                  <td className="py-2 px-4">{prod.nombre}</td>
                  <td className="py-2 px-4">
                    {prod.imagenUrl ? (
                      <img src={prod.imagenUrl} alt={prod.nombre} className="w-12 h-12 object-cover rounded" />
                    ) : "-"}
                  </td>
                  <td className="py-2 px-4">${prod.precio}</td>
                  <td className="py-2 px-4">{prod.stock}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button className="px-3 py-1 bg-[#a0522d] hover:bg-[#5a2a2a] text-white rounded">
                      Editar
                    </button>
                    <button className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-10 text-center text-[#a0522d]">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardAdmin;
