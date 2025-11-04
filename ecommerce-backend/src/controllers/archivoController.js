import { Archivo, Producto, Categoria} from "../models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- SUBIR ARCHIVOS PRODUCTOS (single o multiple) ---
export const subirArchivos = async (req, res) => {
  try {
    const { id } = req.foundRecord; 

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron archivos para subir",
      });
    }

    const archivosCreados = await Promise.all(
      req.files.map(file =>
        Archivo.create({
          nombre: file.filename,
          nombreOriginal: file.originalname,
          tipo: file.mimetype,
          peso: file.size,
          ruta: file.path,
          idProducto: id
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: "Archivos subidos exitosamente",
      files: archivosCreados
    });
  } catch (error) {
    console.error("Error al subir archivos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al subir archivos",
      errors: [error.message]
    });
  }
};

// --- SUBIR PORTADAS CATEGORIAS ---
export const subirArchivosCategoria = async (req, res) => {
  try {
    const { id } = req.foundRecord; 

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No se encontraron archivos" });
    }

    const archivosCreados = await Promise.all(
      req.files.map(file =>
        Archivo.create({
          nombre: file.filename,
          nombreOriginal: file.originalname,
          tipo: file.mimetype,
          peso: file.size,
          ruta: file.path,
          idCategoria: id,        
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: "Archivos subidos a la categoría exitosamente",
      files: archivosCreados
    });
  } catch (error) {
    console.error("Error al subir archivos a categoría:", error);
    return res.status(500).json({ success: false, message: "Error al subir archivos", errors: [error.message] });
  }
};

export const actualizarGaleria = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: 'No se recibieron imágenes.' });
    }

    const archivosCreados = await Promise.all(
      req.files.map(file =>
        Archivo.create({
          nombre: file.filename,
          nombreOriginal: file.originalname,
          tipo: file.mimetype,
          peso: file.size,
          ruta: file.path,
          idProducto: id
        })
      )
    );

    res.status(201).json({
      success: true,
      mensaje: 'Imágenes subidas a la galería correctamente.',
      files: archivosCreados
    });

  } catch (error) {
    console.error("Error al actualizar la galería:", error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor.',
      error: error.message
    });
  }
};

// --- OBTENER ARCHIVOS POR CATEGORIA ---
export const obtenerArchivosPorCategoria = async (req, res) => {
  try {
    const { id } = req.foundRecord;

    const archivos = await Archivo.findAll({
      where: { idCategoria: id },
      attributes: ["id", "nombre", "nombreOriginal", "tipo", "peso", "ruta", "fechaSubida"]
    });

    const images = archivos
      .filter(a => a.tipo.startsWith("image"))
      .map(a => ({
        id: a.id,
        filename: a.nombre,
        originalName: a.nombreOriginal,
        type: a.tipo,
        size: a.peso,
        uploadDate: a.fechaSubida,
        imageUrl: `${req.protocol}://${req.get("host")}/${a.ruta}`, // Usa a.ruta 
        downloadUrl: `${req.protocol}://${req.get("host")}/api/files/download/${a.nombre}` 
      }));

    return res.status(200).json({
      success: true,
      categoryId: parseInt(id),
      totalImages: images.length,
      images
    });
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener archivos",
      errors: [error.message]
    });
  }
};

// --- OBTENER GALERIA ---
export const obtenerGaleria = async (req, res) => {
    try {
        const { id } = req.params;
        
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }
        res.status(200).json({ 
            galeria: producto.galeria || [] 
        });

    } catch (error) {
        console.error("Error al obtener la galería:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
    }
};

// --- OBTENER ARCHIVOS POR PRODUCTO ---
export const obtenerArchivosPorProducto = async (req, res) => {
  try {
    const { id } = req.foundRecord;

    const archivos = await Archivo.findAll({
      where: { idProducto: id },
      attributes: ["id", "nombre", "nombreOriginal", "tipo", "peso", "ruta", "fechaSubida"]
    });

    const images = archivos
      .filter(a => a.tipo.startsWith("image"))
      .map(a => ({
        id: a.id,
        filename: a.nombre,
        originalName: a.nombreOriginal,
        type: a.tipo,
        size: a.peso,
        uploadDate: a.fechaSubida,
        imageUrl: `${req.protocol}://${req.get("host")}/${a.ruta}`, 
        downloadUrl: `${req.protocol}://${req.get("host")}/api/files/download/${a.nombre}`
      }));

    return res.status(200).json({
      success: true,
      productId: parseInt(id),
      totalImages: images.length,
      images
    });
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener archivos",
      errors: [error.message]
    });
  }
};

// --- DESCARGAR ARCHIVO ---
export const descargarArchivo = async (req, res) => {
  try {
    const { fileName } = req.params;
    const archivo = await Archivo.findOne({ where: { nombre: fileName } });

    if (!archivo) return res.status(404).json({ success: false, message: "Archivo no encontrado" });
    if (!fs.existsSync(archivo.ruta)) return res.status(404).json({ success: false, message: "Archivo no disponible en servidor" });

    res.download(archivo.ruta, archivo.nombreOriginal);
  } catch (error) {
    console.error("Error al descargar archivo:", error);
    return res.status(500).json({
      success: false,
      message: "Error al descargar archivo",
      errors: [error.message]
    });
  }
};

// --- ELIMINAR ARCHIVO INDIVIDUAL ---
export const eliminarArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    const archivo = await Archivo.findByPk(id);

    if (!archivo) return res.status(404).json({ success: false, message: "Archivo no encontrado" });

    if (fs.existsSync(archivo.ruta)) fs.unlinkSync(archivo.ruta);
    await archivo.destroy();

    return res.status(200).json({ success: true, message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar archivo",
      errors: [error.message]
    });
  }
};

// --- ELIMINAR TODOS LOS ARCHIVOS DE UN PRODUCTO ---
export const eliminarArchivosDeProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const archivos = await Archivo.findAll({ where: { idProducto } });

    if (!archivos || archivos.length === 0)
      return res.status(200).json({ success: true, message: "El producto no tiene archivos" });

    // Borrar archivos físicos
    archivos.forEach(a => { if (fs.existsSync(a.ruta)) fs.unlinkSync(a.ruta); });

    // Borrar registros en DB
    await Promise.all(archivos.map(a => a.destroy()));

    return res.status(200).json({ success: true, message: `${archivos.length} archivos eliminados` });
  } catch (error) {
    console.error("Error al eliminar archivos de producto:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar archivos de producto",
      errors: [error.message]
    });
  }
};

// --- ELIMINAR TODOS LOS ARCHIVOS DE UNA CATEGORIA ---
export const eliminarArchivosDeCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const archivos = await Archivo.findAll({ where: { idCategoria } });

    if (!archivos || archivos.length === 0)
      return res.status(200).json({ success: true, message: "La categoría no tiene archivos" });

    // Borrar archivos físicos
    archivos.forEach(a => { if (fs.existsSync(a.ruta)) fs.unlinkSync(a.ruta); });

    // Borrar registros en DB
    await Promise.all(archivos.map(a => a.destroy()));

    return res.status(200).json({ success: true, message: `${archivos.length} archivos eliminados` });
  } catch (error) {
    console.error("Error al eliminar archivos de la categoría:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar archivos de la categoría",
      errors: [error.message]
    });
  }
};

// --- SERVIR IMAGEN GENÉRICA ---
export const servirImagen = async (req, res) => {
  try {
    const { fileName } = req.params;
    console.log(`Buscando archivo en DB: ${fileName}`);
    
    const archivo = await Archivo.findOne({ where: { nombre: fileName } });

    if (!archivo) {
      console.log("Archivo NO encontrado en DB.");
      return res.status(404).json({ success: false, message: "Archivo de registro no encontrado" });
    }

    
    const imagePath = archivo.ruta; 

    if (!fs.existsSync(imagePath)) {
      // Si el registro existe, pero el archivo fue borrado
      return res.status(404).json({ success: false, message: "Imagen física no encontrada en servidor" });
    }

    let contentType = "application/octet-stream";
    const ext = path.extname(fileName).toLowerCase();
    if ([".jpg", ".jpeg"].includes(ext)) contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";

    res.setHeader("Content-Type", contentType);
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "public, max-age=86400");
    
    res.sendFile(path.resolve(imagePath)); 

  } catch (error) {
    console.error("Error al servir imagen:", error);
    return res.status(500).json({
      success: false,
      message: "Error al cargar la imagen",
      errors: [error.message]
    });
  }
};
