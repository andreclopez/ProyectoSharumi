import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, rolRequerido }) => {
  const { user, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!user) {
    // no está logueado → lo mando a login
    return <Navigate to="/admin" />;
  }

  if (rolRequerido && user.idRol !== rolRequerido) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
