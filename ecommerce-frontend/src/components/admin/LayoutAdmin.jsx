import { Outlet, Link } from 'react-router-dom';

const LayoutAdmin = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fdf6f0', color: '#a0522d'}}>
      
      {/* Header / Navbar */}
      <header className="p-4 flex justify-between items-center" style={{ background: '#5a2a2a'}}>
        <h1 className="text-2xl font-bold">Sharumi Admin</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/admin/dashboard"
                className="px-3 py-1 rounded hover:bg-[#fdf6f0] transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categorias"
                className="px-3 py-1 rounded hover:bg-[#fdf6f0] transition-colors"
              >
                Categorías
              </Link>
            </li>
            <li>
              <Link
                to="/admin/productos"
                className="px-3 py-1 rounded hover:bg-[#fdf6f0] transition-colors"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                to="/admin/usuarios"
                className="px-3 py-1 rounded hover:bg-[#fdf6f0] transition-colors"
              >
                Usuarios
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center text-[#5a2a2a] py-4 border-t border-[#5a2a2a]">
        © {new Date().getFullYear()} - Administración Sharumi
      </footer>
    </div>
  );
};

export default LayoutAdmin;
