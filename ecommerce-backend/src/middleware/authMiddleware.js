import jwt from "jsonwebtoken";
import { Usuario, Rol } from "../models/index.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // buscamos el usuario y cargamos su rol
    const usuario = await Usuario.findByPk(decoded.id, {
      include: { model: Rol, as: 'rol', attributes: ["codigo"] },
    });

    if (!usuario) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    // guardamos el usuario en el request para que lo use el controlador
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};
