import express from "express";
import { register, login, refreshToken } from "../controllers/authController.js";
import { perfilController } from "../controllers/usuarioController.js";
import { protect } from "../middleware/authMiddleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Registro y login
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// Redirigir al login de Google
router.get("/google", 
  passport.authenticate("google", { 
    scope: ["profile", "email"],
  prompt: 'select_account' 
}));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const usuario = req.user; // Usuario creado o encontrado en la DB

      // Preparar datos mínimos para el frontend
      const userData = {
        id: usuario.id,
        email: usuario.email || "no-email@google.com",
        idRol: usuario.idRol || 2, // Por defecto usuario normal
        nombre: usuario.nombre || "Sin nombre",
      };

      // Generar tokens
      const accessToken = jwt.sign(
        { id: userData.id, rol: userData.idRol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { id: userData.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // Codificar usuario
      const encodedUser = encodeURIComponent(JSON.stringify(userData));

      // Redirigir al frontend con tokens y usuario
      const redirectURL = `http://localhost:5173/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&usuario=${encodedUser}`;
      res.redirect(redirectURL);

    } catch (err) {
      console.error("❌ Error en callback de Google:", err);
      res.redirect("http://localhost:5173/login?error=oauth");
    }
  }
);

// Perfil (ruta protegida)
router.get("/perfil", protect, perfilController);

export default router;
