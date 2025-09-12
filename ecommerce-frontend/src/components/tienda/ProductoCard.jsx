import { Link } from "react-router-dom";

/**
 * Componente para mostrar la información de un producto en forma de tarjeta
 * @param {Object} producto - Datos del producto
 * @param {boolean} isAdmin - Si es true, muestra botones de editar/eliminar
 * @param {Function} onEditar - Función a ejecutar al hacer click en editar
 * @param {Function} onEliminar - Función a ejecutar al hacer click en eliminar
 */
const ProductoCard = ({ producto, isAdmin = false, onEditar, onEliminar }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-transparent hover:border-indigo-500 transition-colors duration-300 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-white">{producto.nombre}</h2>
      <p className="text-lg font-semibold text-green-500 mb-2">Precio: ${producto.precio}</p>
      <p className="text-sm text-gray-400 mb-2">
        Categoría: {producto.categoria?.nombre || producto.categoria || "Sin categoría"}
      </p>
      <p className="text-sm mb-4">
        Stock disponible:{" "}
        <span className={producto.stock > 0 ? "text-green-500" : "text-red-500"}>
          {producto.stock} unidades
        </span>
      </p>

      <Link
        to={`/producto/${producto.id}`}
        className="mt-auto py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-center transition-colors duration-300 mb-2"
      >
        Ver detalles
      </Link>

      {isAdmin && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEditar(producto)}
            className="flex-1 py-2 px-4 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white transition-colors duration-300"
          >
            Editar
          </button>
          <button
            onClick={() => onEliminar(producto.id)}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors duration-300"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductoCard;
