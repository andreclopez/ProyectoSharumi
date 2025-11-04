import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/api.js"
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await API.post("/auth/login", { email, password });
    
    const { user, tokens } = res.data.data;

    const rolesPermitidos = [1, 3];

    if (!rolesPermitidos.includes(user.idRol)) {
        setError("Acceso denegado: Se requiere un rol de Administrador o Vendedor.");
        setTimeout(() => navigate("/"), 2000); 
        return; 
      }
      
      login({ user, tokens });

    const rolesMap = {
      1: "/admin/dashboard", // Administrador
      2: "/",                // Usuario
      3: "/admin/dashboard"  // Vendedor
    };

    const ruta = rolesMap[user.idRol] || "/admin";
    navigate(ruta);

  } catch (err) {
    setError(err.response?.data?.message || "Credenciales inválidas");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#5a2a2a] p-4">
      <div className="bg-[#fdf6f0] rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-[#a0522d]">Sharumi Admin</h1>
        <p className="text-[#5a2a2a]">
          Bienvenido al panel de administración. Iniciá sesión para gestionar la tienda.
        </p> <br />

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]"
            required
          />
          <button
            type="submit"
            className="bg-[#5a2a2a] text-[#fdf6f0] py-3 rounded-lg hover:bg-[#a0522d] transition-colors"
          >
            Iniciar sesión
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <p className="mt-6 text-[#5a2a2a] text-sm">
          Solo usuarios con rol de administrador pueden acceder a esta sección.
        </p>
      </div>
    </div>
  );
};

export default HomeAdmin;
