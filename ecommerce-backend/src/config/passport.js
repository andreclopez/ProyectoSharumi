import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import  { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { Usuario } from "../models/index.js"; 

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Perfil recibido:", profile);

        if (!profile) {
          return done(new Error("Perfil vacío en la respuesta de Google"), null);
        }

        let user = await Usuario.findOne({ where: { proveedorId: profile.id } });

        if (!user) {
          user = await Usuario.create({
            nombre:profile.given_name || profile.displayName,
            apellido:profile.family_name || '',
            email: profile.emails[0].value,
            password: uuidv4(),
            idRol: 2,
            proveedor: "google",
            proveedorId: profile.id || profile._json?.sub,
          });
        }

        // Pasar usuario a la ruta callback
        return done(null, user);
      } catch (err) {
        console.error("Error en GoogleStrategy:", err);
        return done(err, null);
      }
    }
  )
);
