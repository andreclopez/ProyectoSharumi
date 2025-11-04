import { Link } from 'react-router-dom';

/**
 * Página de error 404 - No encontrado
 */
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gray-800/50 rounded-xl p-10 border border-gray-700 shadow-lg max-w-md">
        <h2 className="text-4xl font-bold text-red-500 mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-white mb-4">Página no encontrada</h3>
        <p className="text-gray-400 mb-6">Lo sentimos, la página que estás buscando no existe.</p>
        <Link 
          to="/admin/dashboard" 
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;