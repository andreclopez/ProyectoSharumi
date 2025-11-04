import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import categoriaService from '../../../services/categoriaService';
import Cargando from '../../../components/generales/Cargando';
import Error from '../../../components/generales/Error';
import { Image } from 'lucide-react';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        setCargando(true);
        setError(null);

        const res = await categoriaService.obtenerCategorias();
        console.log("Respuesta de la API:", res);

        // Guardamos el objeto completo de cada categoría
        setCategorias(res.data.data ?? []);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError('Error al cargar las categorías. Por favor, intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    obtenerCategorias();
  }, []);

  if (cargando) return <Cargando mensaje="Cargando categorías..." />;
  if (error) return <Error mensaje={error} />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-extrabold mb-8 text-[#5a2a2a] text-center">Categorías de productos</h2>

      {categorias.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"> 
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="cursor-pointer bg-[#fdf6f0] rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]" 
            >
              <Link to={`/categorias/${categoria.id}`}>
                {/* Contenedor de Imagen */}
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl"> 
                  {categoria.imagenUrl ? (
                    <img
                      src={`${API_BASE_URL}${categoria.imagenUrl}`}
                      alt={categoria.nombre}
                      className="w-full h-full object-cover transition duration-500 hover:opacity-80" 
                    />
                  ) : (
                    <Image className="w-12 h-12 text-[#a0522d]" />
                  )}
                </div>
                {/* Caja de Título */}
                <div className="p-4 bg-[#5a2a2a] rounded-b-xl"> 
                    <h2 className="text-xl font-bold text-center text-[#fdf6f0] tracking-wide">{categoria.nombre}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-[#5a2a2a]">No hay categorías disponibles.</p>
      )}
    </div>
  );
};

export default Categorias;
