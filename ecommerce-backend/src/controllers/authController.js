import { Usuario } from "../models/index.js";
import { Rol } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltBcrypt = 10; 

// función para generar tokens
const generarToken = (usuario) => {
  const accessToken = jwt.sign(
    { id: usuario.id, rol: usuario.Rol?.codigo }, // aseguramos que Rol exista
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
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
    const { nombre, email, password, idRol } = req.body;

    if (!idRol) {
      return res.status(400).json({
        success: false,
        message: "Se requiere el rol",
        data: {},
      });
    }

    // hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, saltBcrypt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      idRol,
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: { id: nuevoUsuario.id, email: nuevoUsuario.email },
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
      include: { model: Rol, attributes: ["codigo"] },
    });

    if (!usuario) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const tokens = generarToken(usuario);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: tokens,
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
      include: { model: Rol, attributes: ["codigo"] },
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
