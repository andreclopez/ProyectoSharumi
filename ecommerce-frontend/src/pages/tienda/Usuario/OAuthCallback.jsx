import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Leer query params usando location.search
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const usuarioParam = params.get("usuario");

    // Si falta algún parámetro, redirigir a login y salir
    if (!accessToken || !refreshToken || !usuarioParam) {
      navigate("/login");
      return;
    }

    const usuario = JSON.parse(decodeURIComponent(usuarioParam));

    // Guardar en AuthContext y localStorage
    login({ user: usuario, tokens: { accessToken, refreshToken } });

    // Redirección según rol
    const rolesMap = {
      1: "/admin/dashboard", // Administrador
      2: "/",                // Usuario
      3: "/admin/dashboard"  // Vendedor
    };
    const ruta = rolesMap[usuario.idRol] || "/home";

    // Navegar a la ruta correspondiente
    navigate(ruta);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); // Solo depende de location.search

  return <p>Redirigiendo...</p>;
}
