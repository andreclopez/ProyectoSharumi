import { useParams, Link } from 'react-router-dom';
import { useProductos } from '../../hooks/useProductos';
import ProductoCard from '../../components/ProductoCard';
import Cargando from '../../components/Cargando';
import Error from '../../components/Error';

const CategoriasPage = () => {
  const { categoria } = useParams();
  const { productos, cargando, error } = useProductos(categoria);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Productos en <span className="text-indigo-400 capitalize">{categoria}</span>
        </h2>
      </div>

      {cargando && <Cargando mensaje={`Cargando productos de ${categoria}...`} />}
      {error && <Error mensaje={error} />}

      {!cargando && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.length > 0 ? (
            productos.map(producto => (
              <ProductoCard key={producto.id} producto={producto} />
            ))
          ) : (
            <p className="text-center col-span-full py-12 text-gray-400">
              No hay productos disponibles en esta categoría.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriasPage;
