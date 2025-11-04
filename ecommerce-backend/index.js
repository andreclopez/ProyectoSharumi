import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from "passport";
import "./src/config/passport.js";
import { sequelize } from './src/models/index.js';
import routes from './src/routes/index.js';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './src/middleware/errorHandler.js'
import { PORT, RAIZ } from './src/db/config.js';

const app = express();

// Middleware de seguridad
app.use(helmet({
  // Desactiva temporalmente el nosniff para archivos estáticos, 
  xContentTypeOptions: false, 
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:"], 
      "connect-src": ["'self'", "http://localhost:5173", "http://localhost:5174"],
    },
  },
}));

// Middleware para leer cookies
app.use(cookieParser());

// Cors
app.use(cors({
    origin:
    process.env.NODE_ENV === 'production'
    ? ['https://sharumi.com']
    : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }),
);

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? "dev" : "combined"));

// Parsing de datos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(passport.initialize());

// Ruta simple de prueba
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '¡Backend funcionando correctamente!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para establecer el encabezado CORP en todos los archivos estáticos
app.use('/uploads', (req, res, next) => {
    // Se usa si el frontend y backend están en diferentes puertos de localhost:
    // La opción más segura es 'same-site' si ambos usan localhost.
    // Si usas dominios diferentes, tendrías que usar 'cross-origin', 
    // pero 'same-site' es la opción preferida para tu configuración actual.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
    next();
});

//Usar rutas impotadas
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware finales

app.use(notFound); // rutas no encontradas

app.use(errorHandler); // manejo globales de errores

//Inicializar base de datos

const iniciarDataBase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    // Para sincronizar cambios (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('📦 Base de datos sincronizada (modo desarrollo)');
    }
  } catch (err) {
    console.error('❌ Error al conectarse a la base de datos:', err);
    process.exit(1);
  }
};

// Iniciar servidor y probar conexión

const startServer = async () => {
  await iniciarDataBase();
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${RAIZ}`)
    console.log(`Salud de la API: ${RAIZ}/health`);
    console.log(`API base: ${RAIZ}/api`);
  });

} 

startServer().catch (error => {
  console.error('❌ Error al iniciar el servidor', error);
  process.exit(1);
})

