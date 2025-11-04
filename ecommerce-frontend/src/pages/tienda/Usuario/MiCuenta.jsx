import React from "react";
import { useAuth } from "../../../context/AuthContext.jsx";

const MiCuenta = () => {
  const { user } = useAuth();

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Apellido:</strong> {user.apellido}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default MiCuenta;
