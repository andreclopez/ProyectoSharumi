import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Tag, ArrowRight } from 'lucide-react';
import ProductoCard from '../../../components/tienda/ProductoCard';

const CategoriaDetalle = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. Definición de la URL base para API e Imágenes
  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
        setCargando(true);
        setError(null);
        try {
            // Llama a Categoría 
            const resCat = await axios.get(`${API_BASE_URL}/api/categorias/${id}`);
            const catData = resCat.data.data || resCat.data;
            setCategoria(catData);
            
            const productosAsociados = (catData.productos || []).map((p) => ({
              ...p,
              imagenUrl: p.imagenUrl || p.imagen || p.imagenURL || null,
            }))
            setProductos(productosAsociados); 

            console.log("Productos normalizados:", productosAsociados);

        } catch (err) {
            console.error('Error al cargar la categoría o productos:', err.response?.data || err);
            setError('Error al cargar los datos. Revisa la consola para más detalles.');
        } finally {
            setCargando(false);
        }
    };
    fetchData();
  }, [id]);

  if (cargando) return <p className="text-center p-8 text-[#5a2a2a]">Cargando categoría...</p>;
  if (error) return <p className="text-center p-8 text-red-600 font-bold">{error}</p>;
  if (!categoria) return <p className="text-center p-8 text-gray-500">Categoría no encontrada.</p>;

  const imageUrl = categoria.imagenUrl ? `${API_BASE_URL.replace('/api', '')}${categoria.imagenUrl}` : null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#fdf6f0] shadow-2xl rounded-2xl my-8"> 
      
      {/* Header de Categoría */}
      <div className="flex items-center gap-4 border-b pb-6 mb-8 border-[#a0522d] border-opacity-50"> 
        {imageUrl && (
            <img 
                src={imageUrl} 
                alt={categoria.nombre} 
                className="w-24 h-24 object-cover rounded-full shadow-lg border-4 border-[#a0522d]" 
            />
        )}

        <div>
            <h2 className="text-4xl font-extrabold text-[#5a2a2a] flex items-center">
                <Tag className="w-8 h-8 mr-3 text-[#a0522d]" />
                {categoria.nombre}
            </h2>
            <p className="text-xl text-gray-700 mt-2">{categoria.descripcion || 'Categoría sin descripción.'}</p>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-[#5a2a2a] flex items-center mb-6">
        <Package className="w-6 h-6 mr-2 text-[#a0522d]" />
        Productos Asociados ({productos.length})
      </h3>
      
      {/* Lista de Productos usando ProductoCard */}
      {productos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {productos.map((prod) => (
            <ProductoCard
                key={prod.id}
                producto={prod}
                apiUrlBase={API_BASE_URL} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-6 text-gray-500 italic border border-dashed border-[#d9b08c] rounded-lg">
            Aún no hay productos en esta categoría.
        </p>
      )}
    </div>
  );
};

export default CategoriaDetalle;