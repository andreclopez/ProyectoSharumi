import { useState, useEffect } from 'react';
import productoService from '../../services/productoService.js';
import Cargando from '../../components/generales/Cargando.jsx';
import Error from '../../components/generales/Error.jsx';
import { TableContainer } from '@mui/material';
import { CubeIcon, ExclamationCircleIcon, Squares2X2Icon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/20/solid';

// Objeto para mapear los nombres de íconos a componentes
const ICONS = {
    CubeIcon: CubeIcon,
    ExclamationCircleIcon: ExclamationCircleIcon,
    Squares2X2Icon: Squares2X2Icon,
    ChatBubbleBottomCenterTextIcon: ChatBubbleBottomCenterTextIcon,
};

// --- Tarjeta de Estadística ---
const StatCard = ({ titulo, valor, color, icono }) => {
    const IconoComponente = ICONS[icono] || CubeIcon; 

    return (
        <div 
            className="p-5 rounded-xl shadow-lg transition-transform transform hover:scale-[1.03] cursor-pointer flex justify-between items-center" 
            style={{ backgroundColor: color, color: '#fdf6f0' }}
        >
            <div>
                <h3 className="text-sm font-medium opacity-80">{titulo}</h3>
                <p className="text-4xl font-extrabold mt-1">{valor}</p>
            </div>
            <IconoComponente className="h-10 w-10 opacity-70" />
        </div>
    );
};

// --- Componente principal ---
const DashboardAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        const respuesta = await productoService.obtenerProductos();
        
        if (respuesta.data && Array.isArray(respuesta.data.data)){
          setProductos(respuesta.data.data);
        } else {
          console.error('El formato de respuesta de la API no es el esperado:', respuesta.data);
          setProductos([]);
        }
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

  // Datos simulados para las tarjetas (Deberían venir de una nueva llamada a la API)
  const productosAgotados = productos.filter(p => p.stock === 0).length;
  const estadisticas = [
    { id: 1, titulo: "Total Productos", valor: productos.length, color: "#a0522d", icono: "CubeIcon" },
    { id: 2, titulo: "Productos Agotados", valor: productosAgotados, color: "#993333", icono: "ExclamationCircleIcon" }, 
    { id: 3, titulo: "Total Categorías", valor: 12, color: "#b85c38", icono: "Squares2X2Icon" },
    { id: 4, titulo: "Nuevos Mensajes", valor: 3, color: "#5a2a2a", icono: "ChatBubbleBottomCenterTextIcon" },
  ];

  return (
    <div className="w-full min-h-screen p-8" style={{ backgroundColor: '#fdf6f0' }}>
      <div className='mb-6'>
        <h2 className="text-2xl font-bold text-[#5a2a2a] flex items-center">
          🍷 Panel de Administración 
        </h2>
      </div>

      {cargando && <Cargando mensaje="Cargando datos..." />}
      {error && <Error mensaje={error} />}

      {!cargando && !error && (
        <>
          {/* SECCIÓN 1: TARJETAS DE ESTADÍSTICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {estadisticas.map((stat) => (
              <StatCard key={stat.id} {...stat} /> 
            ))}
          </div>

          {/* SECCIÓN 2: GRÁFICOS (Implementarías aquí los gráficos de Recharts) */}
          <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 h-96">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#4e2a2a' }}>Gráfico de Inventario (Ej. Recharts)</h3>
                {/* Aquí iría el componente <InventarioChart /> */}
                <div className="flex items-center justify-center h-[calc(100%-40px)] text-gray-400 border border-dashed rounded">
                    Espacio para Gráfico (Recharts)
                </div>
            </div>
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#4e2a2a' }}>Actividad Reciente</h3>
                <p className='text-sm text-gray-600'>Lista de últimos pedidos o mensajes.</p>
                {/* Lista de últimos elementos... */}
            </div>
          </div>

          {/* SECCIÓN 3: TABLA DE GESTIÓN (Tú tabla de productos) */}
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: '#4e2a2a' }}
          >
            Listado de Productos
          </h3>

          <TableContainer
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)' 
            }}
          >
            <table className="w-full text-left border-collapse bg-white rounded shadow-md">
              <thead className="bg-[#5a2a2a] text-[#fdf6f0]">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl">ID</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Imagen</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 rounded-tr-xl">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapeo de productos (igual que tu código original) */}
                {productos.length > 0 ? (
                  productos.map((prod) => (
                    <tr key={prod.id} className="border-b border-gray-100 hover:bg-[#fdf6f0] transition duration-150">
                      <td className="py-2 px-4 text-[#4e2a2a]">{prod.id}</td>
                      <td className="py-2 px-4 font-semibold text-[#4e2a2a]">{prod.nombre}</td>
                      <td className="py-2 px-4">
                        {prod.imagenUrl ? (
                          <img src={prod.imagenUrl} alt={prod.nombre} className="w-14 h-14 object-cover rounded-md border border-[#a0522d] p-0.5" />
                        ) : <span className='text-gray-400'>-</span>}
                      </td>
                      <td className="py-2 px-4 text-[#7d5a5a] font-mono">${prod.precio}</td>
                      <td className={`py-2 px-4 font-bold ${prod.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>{prod.stock}</td>
                      <td className="py-2 px-4 space-x-2">
                      <button className="px-3 py-1 bg-[#a0522d] hover:bg-[#b85c38] text-white rounded-md font-medium text-sm shadow-md transition">
                        Editar
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-800 text-white rounded-md font-medium text-sm shadow-md transition">
                        Eliminar
                      </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-[#a0522d]/70 bg-gray-50">
                      No hay productos disponibles. ¡Es hora de agregar algunos!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default DashboardAdmin;