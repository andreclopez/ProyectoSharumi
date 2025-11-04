// src/components/tienda/UserMenu.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-4 text-white p-3 rounded-lg">
      {user ? (
        <>
          <span>Hola, {user.nombre}!</span>
          <Link to="/mi-cuenta" className="hover:underline">Mi cuenta</Link>
          <Link to="/mis-compras" className="hover:underline">Mis compras</Link>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="bg-white px-3 py-1 rounded hover:bg-gray-200">
          Ingresá
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
