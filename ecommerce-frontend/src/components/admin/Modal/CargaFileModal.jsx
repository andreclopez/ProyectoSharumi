import React, { useState, useEffect } from "react";
import { Trash2, Upload, X } from "lucide-react";
import Loader from "../../../components/admin/Loader.jsx";
import api from "../../../services/api.js";

const CargaFileModal = ({ 
  productId, 
  tipo = "archivo", 
  onClose, 
  onFilesUploaded 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // limpiar URLs temporales
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  // util para validar
  const validateFiles = (files) => {
    return files
      .filter(f => f.size <= 10 * 1024 * 1024) // max 10MB
      .map(f => Object.assign(f, { preview: URL.createObjectURL(f) }));
  };

  const handleFileChange = (e) => {
    const files = validateFiles(Array.from(e.target.files));
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = validateFiles(Array.from(e.dataTransfer.files));
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("archivos", file);
      });
      
      const response = await api.post(`/files/upload/galeria/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        setUploadedFiles([]);
        if (onFilesUploaded) onFilesUploaded(response.data.files); // devolvemos lo que el backend creó
        onClose();
      } else {
        setError(response.data?.message || "Error al subir los archivos");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al subir los archivos");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader title="Subiendo archivos..." />;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-pink-50 rounded-lg shadow-2xl w-full max-w-md p-6 z-10 border border-pink-200/50">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center">
          <Upload className="mr-2" size={24} />
          Subir {tipo === "imagen" ? "Imágenes" : "Archivos"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Drag & Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer ${
              isDragging ? "border-pink-500 bg-pink-100" : "border-pink-300 bg-white"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <p className="text-sm text-gray-600 mb-2">Arrastra {tipo}s o haz click</p>
            <p className="text-xs text-gray-400 mb-2">
              {tipo === "imagen" 
                ? "PNG, JPG (máx. 10MB)" 
                : "PDF, DOCX, XLSX, PNG, JPG (máx. 10MB)"}
            </p>
            <input
              type="file"
              className="hidden"
              id="fileInput"
              multiple
              accept={tipo === "imagen" ? "image/*" : undefined}
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="inline-block px-4 py-2 rounded-md bg-pink-200 text-gray-700 hover:bg-pink-300 cursor-pointer"
            >
              Seleccionar {tipo === "imagen" ? "Imágenes" : "Archivos"}
            </label>
          </div>

          {/* Lista de archivos */}
          {uploadedFiles.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between border rounded-md px-3 py-2 bg-white">
                  <div className="flex items-center gap-2">
                    {tipo === "imagen" && file.type.startsWith("image/") && (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-400 text-white font-bold rounded-md hover:bg-pink-500 hover:shadow-lg transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargaFileModal;
