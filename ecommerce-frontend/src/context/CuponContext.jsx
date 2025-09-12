import { createContext, useState } from "react";

const CuponContext = createContext();

export const CuponProvider = ({ children }) => {
  const [cuponActivo, setCuponActivo] = useState(null);

  const aplicarCupon = (cupon) => setCuponActivo(cupon);
  const quitarCupon = () => setCuponActivo(null);

  return (
    <CuponContext.Provider value={{ cuponActivo, aplicarCupon, quitarCupon }}>
      {children}
    </CuponContext.Provider>
  );
};

export default CuponContext