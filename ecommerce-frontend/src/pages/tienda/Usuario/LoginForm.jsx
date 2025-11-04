import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../services/api.js";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      setError("");

      // usamos API en vez de axios directo
      const res = await API.post("/auth/login", { email, password });

      // destructuramos de la respuesta
      const { user, tokens } = res.data.data;

      // pasamos al contexto
      login({ user, tokens });

      const rolesMap = {
        1: "/admin/dashboard", 
        2: "/",                
        3: "/admin/dashboard"  
      };

      const ruta = rolesMap[user.idRol] || "/admin";
      navigate(ruta);
      
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.response?.data?.message || "Credenciales inválidas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-[#fdf6f0] rounded-3xl shadow-2xl p-10 max-w-md w-full text-center mx-auto"> 
      <h1 className="text-4xl font-extrabold mb-2 text-[#5a2a2a]">Sharumi</h1> 
      <p className="text-[#a0522d] mb-6">
        Iniciá sesión para acceder a tu cuenta.
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all" 
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all"
          required
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-[#5a2a2a] text-[#fdf6f0] py-4 rounded-xl font-bold text-lg hover:bg-[#a0522d] transition-colors disabled:opacity-50" 
        >
          {cargando ? "Iniciando..." : "Iniciar sesión"}
        </button>

        <button
          type="button"
          onClick={() => window.location.href = "http://localhost:3001/api/auth/google"}
          className="bg-[#a0522d] text-[#fdf6f0] py-4 rounded-xl font-bold text-lg hover:bg-[#5a2a2a] transition-colors" 
        >
          Iniciar sesión con Google
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <p className="mt-6 text-[#5a2a2a] text-base"> 
        ¿No tenés cuenta? <br />
        <span
          onClick={() => navigate("/registro")}
          className="cursor-pointer font-bold text-[#a0522d] hover:underline" 
        >
          Registrate
        </span>{" "}
        pronto en Sharumi ✨
      </p>
    </div>
  );
};

export default LoginForm;
