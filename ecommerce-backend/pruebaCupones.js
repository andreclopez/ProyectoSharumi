import { CuponDescuento } from './src/models/index.js'; 
import sequelize from './src/db/connection.js'; 

async function crearCuponesDePrueba() {
  try {
    await sequelize.sync(); 

    await CuponDescuento.create({
      codigoCupon: 'SHARULOVE10',
      nombreCupon: '10% off para Sharulovers',
      porcentajeDescuento: 10,
      activo: true
    });

    await CuponDescuento.create({
      codigoCupon: 'SHARU20',
      nombreCupon: 'Descuento del 20%',
      porcentajeDescuento: 20,
      activo: true
    });

    console.log('Cupones creados con éxito');
    process.exit();
  } catch (error) {
    console.error('Error al crear cupones:', error);
    process.exit(1);
  }
}

crearCuponesDePrueba();
