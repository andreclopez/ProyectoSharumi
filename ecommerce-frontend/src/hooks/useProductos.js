import { useState, useEffect } from "react";
import productoService from "../services/productoService.js";

export const useProductos = (categoria = null) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        let respuesta;

        if (categoria) {
          respuesta = await productoService.obtenerProductosPorCategoria(categoria);
        } else {
          respuesta = await productoService.obtenerTodos();
        }

        setProductos(respuesta.data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No pudimos cargar los productos. Intenta de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, [categoria]);

  return { productos, cargando, error };
};
