import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuario y token desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("accessToken");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAccess) setAccessToken(storedAccess);

    setCargando(false);
  }, []);

  // Función para guardar usuario y token en estado y localStorage
  const login = (data) => {
    if (data?.user) {
      let rol;
      switch (Number(data.user.idRol)) {  
      case 1: rol = "admin"; break;
      case 2: rol = "cliente"; break;
      case 3: rol = "vendedor"; break;
      default: rol = "invitado";
    }

    const userWithRol = { ...data.user, rol };
    setUser(userWithRol);
    localStorage.setItem("user", JSON.stringify(userWithRol));
  }

  if (data?.tokens?.accessToken) {
    setAccessToken(data.tokens.accessToken);
    localStorage.setItem("accessToken", data.tokens.accessToken);
    }
  };

  // Logout: limpia estado y localStorage
  const logout = () => {
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
