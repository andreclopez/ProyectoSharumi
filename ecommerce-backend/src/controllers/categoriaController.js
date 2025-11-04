import { Categoria, Producto, Archivo} from '../models/index.js';
import fs from 'node:fs';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const obtenerCategoriasActivas = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Parámetros de consulta inválidos",
        errors: errors.array(),
      });
    }

    const { page = 1, limit = 10, search = '', status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Búsqueda por nombre o descripción
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filtro por estado
    if (status === 'true') whereClause.activa = true;
    else if (status === 'false') whereClause.activa = false;
    

    const categorias = await Categoria.findAndCountAll({
      where: whereClause, 
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nombre", "ASC"]],
    });
    
    res.status(200).json({
      success: true,
      message: "Categorías obtenidas exitosamente",
      data: categorias.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(categorias.count / limit),
        totalItems: categorias.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Parámetros inválidos",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const categoria = await Categoria.findByPk(id, { 
      include: [
        {
          model: Producto,
          as: 'productos', 
          attributes: ['id', 'nombre', 'precio', 'imagenUrl'] 
        }
      ]
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    } 
      return res.status(200).json({ 
        success: true,
        message: 'Categoría obtenida exitosamente',
        data: categoria
     });
    } catch (error) {
      console.error("Error al obtener categoría por ID:", error);
      return res.status(500).json({ 
        success: false,
        message: 'Error interno del servidor', 
        error: error.message 
      });
    }
  };


export const crearCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "La imagen es obligatoria" });
    }

    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion ?? '';
    const activa = req.body.activa === 'true' || req.body.activa === true;
    const imagenUrl = `/uploads/categorias/portadas/${req.file.filename}`;

    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      activa,
      imagenUrl,
    });

      // Crear archivo (portada)
    const nuevoArchivo = await Archivo.create({
      nombre: req.file.filename,
      nombreOriginal: req.file.originalname,
      tipo: req.file.mimetype,
      peso: req.file.size,
      ruta: req.file.path,
      idCategoria: nuevaCategoria.id
    });

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: {
        ...nuevaCategoria.toJSON(),
        portada: nuevoArchivo
      }
    }); 
  } catch (error) {
    console.error("Error al crear categoría:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: 'Error de validación', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array()
      });
    }

    // Buscar la categoría
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }
    
    const { nombre, descripcion, activa } = req.body || {};
    const datosActualizados = {};

    if (nombre !== undefined) datosActualizados.nombre = nombre;
    if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
    if (activa !== undefined) {
      datosActualizados.activa = (activa === 'true' || activa === true); 
    }

    // Si hay nueva portada
    if (req.file) {
      const imagenUrl = `/uploads/categorias/portadas/${req.file.filename}`;
      datosActualizados.imagenUrl = imagenUrl;

      const rutaAnterior = categoria.imagenUrl;

      const archivoAnterior = await Archivo.findOne({
        where: { idCategoria: categoria.id }
      });

      if (rutaAnterior && rutaAnterior.includes('/uploads/')) {
        const rutaFisicaAnterior = rutaAnterior.substring(1);

        if (fs.existsSync(rutaFisicaAnterior)) {
          fs.unlinkSync(rutaFisicaAnterior);
          console.log(`Archivo anterior eliminado: ${rutaFisicaAnterior}`);
        }
      }

      if (archivoAnterior) {
        await archivoAnterior.destroy();
      }

      // Crear registro en Archivo
      await Archivo.create({
        nombre: req.file.filename,
        nombreOriginal: req.file.originalname,
        tipo: req.file.mimetype,
        peso: req.file.size,
        ruta: req.file.path,
        idCategoria: categoria.id
      });
    }

    // Actualizar categoría
    const categoriaActualizada = await categoria.update(datosActualizados);

    return res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      data: categoriaActualizada
    });

  } catch (error) {
    console.error("Error al actualizar categoría:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos existencia
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    // Eliminamos los archivos asociados antes
    await Archivo.destroy({ where: { idCategoria: id } });

    // Ahora sí, eliminamos la categoría
    await categoria.destroy();

    return res.status(200).json({
      success: true,
      message: "Categoría y archivos eliminados correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const actualizarPortadaCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se encontró el archivo de portada" });
        }

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: "Categoría no encontrada" });
        }
        
        const imagenUrl = `/uploads/categorias/portadas/${req.file.filename}`;

        const rutaAnterior = categoria.imagenUrl;
        const archivoAnterior = await Archivo.findOne({ where: { idCategoria: categoria.id } });

        if (rutaAnterior && rutaAnterior.includes('/uploads/')) {
          const rutaFisicaAnterior = rutaAnterior.substring(1);
          if (fs.existsSync(rutaFisicaAnterior)) {
            fs.unlinkSync(rutaFisicaAnterior);
            console.log(`Archivo anterior eliminado: ${rutaFisicaAnterior}`);
          }
        }

        if (archivoAnterior) {
          await archivoAnterior.destroy();
        }

        // 4. Crear nuevo registro en Archivo
        const nuevoArchivo = await Archivo.create({
          nombre: req.file.filename,
          nombreOriginal: req.file.originalname,
          tipo: req.file.mimetype,
          peso: req.file.size,
          ruta: req.file.path,
          idCategoria: categoria.id
        });

        const categoriaActualizada = await categoria.update({ imagenUrl });

        return res.status(200).json({
            success: true,
            message: "Portada de categoría actualizada exitosamente",
            data: categoriaActualizada,
            archivo: nuevoArchivo
        });

    } catch (error) {
        console.error("Error al actualizar portada de categoría:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor", error: error.message });
    }
};