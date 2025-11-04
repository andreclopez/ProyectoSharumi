const validateExistencia = (modelo, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const id = req.params[idParam];

      if (!id) {
        return res.status(400).json({
          error: `ID de ${modelo.name} es requerido`
        });
      }

      const record = await modelo.findByPk(id);

      if (!record) {
        return res.status(404).json({
          error: `${modelo.name} no encontrado`
        });
      }

      req.foundRecord = record;
      next();

    } catch (error) {
      console.error('Error en middleware de validación:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  };

}

export default validateExistencia;