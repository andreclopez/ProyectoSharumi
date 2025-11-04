import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api.js"; 

const Registro = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden");
    return;
  }

  try {
    await API.post("/auth/register", {
      nombre,
      apellido,
      email,
      password,
      rol: 2,       
      activo: true, 
    });

    setSuccess("Registro exitoso! Ahora podés iniciar sesión.");
    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Error al registrarse");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5a2a2a] to-[#a0522d] p-6"> 
      <div className="bg-[#fdf6f0] rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center"> 
        <h1 className="text-4xl font-extrabold mb-6 text-[#5a2a2a]">Crear Cuenta Sharumi</h1>


         <form onSubmit={handleRegister} className="flex flex-col gap-5"> 
            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all"
            />

            <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all"
            />
            <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#5a2a2a] focus:ring-opacity-50 transition-all"
            />
            <button
                type="submit"
                className="bg-[#5a2a2a] text-[#fdf6f0] py-4 rounded-xl font-bold text-lg hover:bg-[#a0522d] transition-colors" 
            >
                Registrarse
            </button>
        </form>


        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}

      </div>
    </div>
  );
};

export default Registro;
