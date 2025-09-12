import 'dotenv/config';
import express from 'express';
import { sequelize } from './src/models/index.js';
import routes from './src/routes/index.js';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './src/middleware/errorHandler.js'

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet());

// Middleware para leer cookies
app.use(cookieParser());

// Cors
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
  ? ['https://sharumi.com']
  : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? "dev" : "combined"));

// Parsing de datos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Ruta simple de prueba
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '¡Backend funcionando correctamente!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

//Usar rutas impotadas
app.use('/api', routes);

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
    console.log(`Servidor corriendo en puerto ${PORT}`)
    console.log(`Salud de la API: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api`);
  });

} 

startServer().catch (error => {
  console.error('❌ Error al iniciar el servidor', error);
  process.exit(1);
})

