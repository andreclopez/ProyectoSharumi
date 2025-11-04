import { Producto, PedidoxProducto, CarritoxProducto, Mensaje, Archivo, Categoria, Usuario } from '../models/index.js';
import { validationResult } from 'express-validator';
import fs from 'node:fs';
import { Op } from 'sequelize';

// --- OBTENER TODOS LOS PRODUCTOS (con filtros opcionales) ---
export const obtenerProductos = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Parámetros de consulta inválidos",
        errors: errors.array(),
      });
    }

    const { page = 1, limit = 10, categoria, oferta, descuentoMin } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (categoria) whereClause.idCategoria = categoria;
    if (oferta === 'true') whereClause.oferta = true;
    if (descuentoMin) whereClause.descuento = { [Op.gte]: Number(descuentoMin) };

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }], 
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fechaAlta', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: "Productos obtenidos exitosamente",
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      errors: [error.message]
    });
  }
};

// --- OBTENER PRODUCTO POR ID ---
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [{ model: Categoria, as:'categoria', attributes: ['id', 'nombre'] }] 
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.status(200).json({
      success: true,
      message: "Producto obtenido exitosamente",
      data: producto
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      errors: [error.message]
    });
  }
};

// --- CREAR PRODUCTO ---
export const crearProducto = async (req, res) => {

  try {
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Datos inválidos", errors: errors.array() });
    }

    const portadaFile = req.files && req.files.portada ? req.files.portada[0] : null; 
    
    if (!portadaFile) { 
      return res.status(400).json({ success: false, message: "La imagen de portada es obligatoria." });
    }

    const galeriaFiles = req.files && req.files.galeria ? req.files.galeria : [];   // 👈 OBTENER GALERÍA

    // Extraer campos y convertir manualmente los números
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion ?? '';
    const precio = parseFloat(req.body.precio);
    const stock = parseInt(req.body.stock);
    const idUsuario = parseInt(req.body.idUsuario);
    const idCategoria = req.body.idCategoria ? parseInt(req.body.idCategoria) : null;
    const oferta = req.body.oferta === 'true';
    const descuento = parseFloat(req.body.descuento) || 0;
    
    const imagenUrlParaDB = `/uploads/productos/portadas/${portadaFile.filename}`;

    if (req.file) {
        const baseUploadPath = 'uploads/productos/portadas'; 
        const fileRoute = req.file.path.split(baseUploadPath)[1] || `/${req.file.filename}`;
        
        imagenUrlParaDB = `/uploads/productos/portadas/${req.file.filename}`;
    }

    // Validar usuario
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Validar categoría (si se pasó)
    let categoria = null;
    if (idCategoria) {
      categoria = await Categoria.findByPk(idCategoria);
      if (!categoria) {
        return res.status(404).json({ success: false, message: "Categoría no encontrada" });
      }
    }

    // Crear producto
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      idUsuario,
      idCategoria,
      oferta,
      descuento, 
      imagenUrl: imagenUrlParaDB,
    });

    let nuevoArchivo = null; 
    
    if (portadaFile) { 
        const galeriaFiles = req.files && req.files.galeria ? req.files.galeria : [];
        const archivosAguardar = [];

    // Crear archivo (portada)
    archivosAguardar.push(Archivo.create({
        nombre: portadaFile.filename,
        nombreOriginal: portadaFile.originalname,
        tipo: portadaFile.mimetype,
        peso: portadaFile.size,
        ruta: portadaFile.path,
        idProducto: nuevoProducto.id
    }));

    galeriaFiles.forEach(file => {
        archivosAguardar.push(Archivo.create({
            nombre: file.filename,
            nombreOriginal: file.originalname,
            tipo: file.mimetype,
            peso: file.size,
            ruta: file.path,
            idProducto: nuevoProducto.id
        }));
    });

    await Promise.all(archivosAguardar);

    nuevoArchivo = await archivosAguardar[0]; 
    
    }
    
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: {
        ...nuevoProducto.toJSON(),
        categoria: categoria ? { id: categoria.id, nombre: categoria.nombre } : null,
        portada: nuevoArchivo
      }
    });

  } catch (error) {
    console.error("Error al crear producto:", error);
    const validationError = error.errors?.map(e => e.message) || [error.message];
    res.status(500).json({ success: false, message: "Error interno del servidor", errors: validationError });
  }
};

// --- ACTUALIZAR PRODUCTO ---
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

    const { idCategoria } = req.body || {}; 
    let categoria = null;

    if (idCategoria) {
      categoria = await Categoria.findByPk(idCategoria); 
      if (!categoria) return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }

    const datosActualizados = req.body;

    if (req.file) { 
      const imagenUrl = `/uploads/productos/portadas/${req.file.filename}`;
      datosActualizados.imagenUrl = imagenUrl; 
      
      const rutaAnterior = producto.imagenUrl; 

      // 1. Si existe una portada anterior
      if (rutaAnterior && rutaAnterior.includes('/uploads/')) {
        const rutaFisicaAnterior = rutaAnterior.substring(1); 
        
        // 2. Buscar y eliminar el registro de Archivo asociado a esa portada
        const archivoAnterior = await Archivo.findOne({ 
            where: { nombre: rutaAnterior.split('/').pop(), idProducto: producto.id }
        });
        
        if (archivoAnterior) {
            await archivoAnterior.destroy();
        }
        
        // 3. Eliminar el archivo físico
        if (fs.existsSync(rutaFisicaAnterior)) {
          fs.unlinkSync(rutaFisicaAnterior);
          console.log(`Portada anterior eliminada: ${rutaFisicaAnterior}`);
        }
      }
      // 2. Crear registro en Archivo
      await Archivo.create({
        nombre: req.file.filename,
        nombreOriginal: req.file.originalname,
        tipo: req.file.mimetype,
        peso: req.file.size,
        ruta: req.file.path,
        idProducto: producto.id
      });
    }

    const productoActualizado = await producto.update(datosActualizados);
    
    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: {
        ...productoActualizado.toJSON(),
        categoria: categoria ? { id: categoria.id, nombre: categoria.nombre } : null
      }
    });

  } catch (error) {
    console.error("Error al actualizar producto:", error);
    const validationError = error.errors?.map(e => e.message) || [error.message];
    res.status(500).json({ success: false, message: "Error interno del servidor", errors: validationError });
  }
};

// --- ELIMINAR PRODUCTO ---
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

    await Mensaje.destroy({ where: { idProducto: id } });
    await CarritoxProducto.destroy({ where: { idProducto: id } });
    await PedidoxProducto.destroy({ where: { idProducto: id } });

    await producto.destroy();

    res.status(200).json({ success: true, message: "Producto eliminado en cascada (manual)" });

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor", error: error.message });
  }
};
