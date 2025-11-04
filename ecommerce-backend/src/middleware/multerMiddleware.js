import multer from "multer";
import fs from "node:fs";
import path from "node:path";

// Tipos permitidos y tamaño máximo 
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Usamos el nombre del campo para una mejor retroalimentación
    cb(new Error(`Tipo de archivo no permitido para el campo ${file.fieldname}`), false);
  }
};

// Tamaño máximo 10MB
const maxSize = 10 * 1024 * 1024; // bytes

// --- STORAGE GENÉRICO Y PARA GALERÍA (por ID de Producto) ---
const storageGenerico = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Usamos idProducto para subidas existentes, o id para la ruta :id/galeria
      const idTarget = req.params.idProducto || req.params.id || 'temp'; 
      const uploadDir = `uploads/productos/${idTarget}`;
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const fileExt = path.extname(file.originalname).toLowerCase();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      cb(null, `${timestamp}-${randomStr}${fileExt}`);
    } catch (error) {
      cb(error, null);
    }
  }
});

const upload = multer({ storage: storageGenerico, fileFilter, limits: { fileSize: maxSize } });

// Middleware para subida MÚLTIPLE (Galeria/Archivos) 
const uploadMultiple = (fieldName, maxCount = 10) => {
  return upload.array(fieldName, maxCount);
}

// --- STORAGE PARA PORTADA DE PRODUCTO (Ruta estática) ---
const storagePortada = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `uploads/productos/portadas`;
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    try {
      const fileExt = path.extname(file.originalname).toLowerCase();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      cb(null, `${timestamp}-${randomStr}${fileExt}`);
    } catch (error) {
      cb(error, null);
    }
  }
});

const uploadPortada = multer({ storage: storagePortada, fileFilter, limits: { fileSize: maxSize } });

// CATEGORIA
const storageCategoria = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/categorias/portadas';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const uploadCategoria = multer({ storage: storageCategoria, fileFilter, limits: { fileSize: maxSize } });


// --- STORAGE PARA COMBINACIÓN (portada + galería en creación) ---

const combinedStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;
        if (file.fieldname === 'portada') {
            uploadDir = 'uploads/productos/portadas';
        } else if (file.fieldname === 'galeria') {
            const idProducto = req.params.id || 'temp'; 
            uploadDir = `uploads/productos/${idProducto}`; 
        } else {
            uploadDir = 'uploads/otros';
        }

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        try {
            const fileExt = path.extname(file.originalname).toLowerCase();
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            cb(null, `${timestamp}-${randomStr}${fileExt}`);
        } catch (error) {
            cb(error, null);
        }
    }
});

const uploadCombined = multer({ storage: combinedStorage, fileFilter, limits: { fileSize: maxSize } });

const uploadFields = uploadCombined.fields([
    { name: 'portada', maxCount: 1 },
    { name: 'galeria', maxCount: 10 }
]);

export { 
    upload, 
    uploadPortada, 
    uploadCategoria, 
    uploadMultiple, 
    uploadFields 
};