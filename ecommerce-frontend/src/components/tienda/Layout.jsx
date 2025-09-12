import { Outlet, Link } from 'react-router-dom';

/**
 * Componente de layout principal que incluye el encabezado y navegación
 */
const Layout = ({ title = 'Catálogo de Productos', subtitle = 'Demo de conexión React-Backend con Axios' }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">{title}</h1>
          <p className="text-gray-400 mb-6">{subtitle}</p>
          <nav className="mt-6">
            <ul className="flex justify-center space-x-8">
              <li>
                <Link to="/" className="px-4 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors duration-300">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="px-4 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors duration-300">
                  Categorías
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        
        <main className="flex-grow w-full">
          <Outlet />
        </main>
        
        <footer className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} - Sharumi, tres latitudes </p>
        </footer>
      </div>
    </div>
  );
};



export default Layout;
