export const errorHandler = (err, req, res, next) => {
  console.error("Error capturado por middleware:", err);

  // Error de validación de Sequelize
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));

    return res.status(400).json({
      success: false,
      type: "ValidationError",
      message: "Error de validación",
      details: errors
    });
  }

  // Error de clave única de Sequelize
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      type: "UniqueConstraintError",
      message: "Ya existe un registro con estos datos"
    });
  }

  // Error de clave foránea de Sequelize
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      type: "ForeignKeyConstraintError",
      message: "No se pudo establecer la relación (clave foránea inválida)"
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    success: false,
    type: "ServerError",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Ocurrió un error inesperado",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    type: "NotFound",
    message: `La ruta ${req.originalUrl} no existe`
  });
};

export default {
  errorHandler,
  notFound
};
