import { Usuario } from "../models/index.js";
import { Rol } from "../models/index.js";
import jwt from "jsonwebtoken";

// Generar tokens
const generarToken = (usuario) => {
  const accessToken = jwt.sign(
    { id: usuario.id, rol: usuario.Rol?.codigo },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: usuario.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// registrar un nuevo usuario
export const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      idRol: 2
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: { 
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre, 
        email: nuevoUsuario.email,
        idRol: nuevoUsuario.idRol  
      },
    });
  } catch (error) {
    next(error);
  }
};

// iniciar sesión
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { email },
      include: { model: Rol, as: "rol", attributes: ["codigo"] },
    });

    if (!usuario) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    const isMatch = await usuario.validarPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    const tokens = generarToken(usuario);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        user: {
          id: usuario.id,
          email: usuario.email,
          idRol: usuario.idRol,
          nombre: usuario.nombre,
          rol: usuario.rol?.codigo || null, // 🔹 opcional
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// refrescar token
export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de refresco no proporcionado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const usuario = await Usuario.findByPk(decoded.id, {
      include: { model: Rol, as: 'rol', attributes: ["codigo", "nombre"] },
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const tokens = generarToken(usuario);
    res.json({
      success: true,
      message: "Token refrescado exitosamente",
      data: tokens,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Token de refresco inválido",
      });
    }
    next(error);
  }
};
