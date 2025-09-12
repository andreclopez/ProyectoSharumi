import { useContext } from "react";
import CuponContext from "../context/CuponContext.jsx";

export const useCupon = () => {
  const context = useContext(CuponContext);
  if (!context) {
    throw new Error("useCupon debe usarse dentro de un CuponProvider");
  }
  return context;
};
