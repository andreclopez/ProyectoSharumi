import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext"
import { ArrowRightStartOnRectangleIcon, 
  UserIcon,
  HomeIcon, 
  Squares2X2Icon,
  CubeIcon,
} from '@heroicons/react/20/solid';
import StorefrontIcon from '@mui/icons-material/Storefront';

const SidebarAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/admin");
};


  return (
        <div className="flex flex-col h-screen w-64 bg-[#5a2a2a] text-[#a0522d]">
      
      <div className="px-6 py-4 text-lg font-bold border-b border-[#a0522d]">
        Sharumi Admin
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/"
          className="flex items-center font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <StorefrontIcon className="h-5 w-5" />
          <span>Ir a la tienda</span>
        </Link>

        <Link
          to="/admin/dashboard"
          className="flex items-center font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/admin/usuarios"
          className="flex items-center font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <UserIcon className="h-5 w-5" />
          <span>Usuarios</span>
        </Link>

        <Link
          to="/admin/categorias"
          className="flex items-center font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <Squares2X2Icon className="h-5 w-5" />
          <span>Categorías</span>
        </Link>

        <Link
          to="/admin/productos"
          className="flex items-center font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <CubeIcon className="h-5 w-5" />
          <span>Productos</span>
        </Link>

        {/* 
        <Link
          to="/admin/galeria"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <FolderIcon className="h-5 w-5" />
          <span>Galeria de Imágenes</span>
        </Link>*/}

      </nav>

      <div className="px-4 py-6 border-t border-[#a0522d]">
        <button
          onClick={handleLogout}
          className="flex items-center font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#fdf6f0] transition"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
