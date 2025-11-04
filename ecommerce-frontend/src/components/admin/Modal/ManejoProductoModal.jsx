import { useState } from "react";
import Loader from "../../components/Loader";
import api from "../../services/api.js";
import CargaFileModal from "./CargaFileModal";

const ManejoProductoModal = ({ isOpen = true, onClose, product, onSave }) => {
  const [id] = useState(product?.id || "");
  const [name, setName] = useState(product?.nombre || "");
  const [price, setPrice] = useState(product?.precio || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [description, setDescription] = useState(product?.descripcion || "");
  const [imagenPath, setImagenPath] = useState(getRelativePath(product?.imagenUrl) || ""); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCargaModal, setShowCargaModal] = useState(false);

  const validarFormulario = () => {
    if (!name.trim()) return "El nombre del producto no puede estar vacío.";
    if (price <= 0) return "El precio debe ser mayor a 0.";
    if (stock < 0) return "El stock no puede ser negativo.";
    return null;
  };

  const getRelativePath = (url) => {
    if (!url) return '';
    const uploadsIndex = url.indexOf('/uploads/');
    return uploadsIndex !== -1 ? url.substring(uploadsIndex) : url;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validarFormulario();
    if (validationError) return setError(validationError);

    setIsLoading(true);
    try {
      const productData = {
        nombre: name,
        precio: parseFloat(price),
        stock: parseInt(stock),
        descripcion: description,
        imagenUrl: imagenPath, 
      };

      const response = await api.put(`/productos/${id}`, productData);

      if (response.data?.success) {
        if (onSave) onSave(response.data.producto);
        onClose();
      } else {
        setError(response.data?.message || "Error al actualizar el producto.");
      }
    } catch (err) {
      setError(err.message || "Error al actualizar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  if (isLoading) return <Loader title="Actualizando producto..." />;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-pink-50 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-gray-900"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-pink-900 mb-6">
          Actualizar Producto
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Producto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-400"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-400"
            />
          </div>

          {/* Imagen actual + botón para abrir CargaFileModal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen del Producto
            </label>
            {imagenPath && (
              <img
                src={`${import.meta.env.VITE_API_URL.replace('/api','')}${imagenPath}`} 
                alt="preview"
                className="mt-2 max-h-40 object-contain rounded-md border"
              />
            )}
            <button
              type="button"
              onClick={() => setShowCargaModal(true)}
              className="mt-2 px-4 py-2 bg-pink-200 text-gray-700 rounded hover:bg-pink-300"
            >
              Cambiar Imagen
            </button>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#5a2a2a] text-white rounded-md hover:bg-[#a0522d]"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Modal de carga de archivos */}
      {showCargaModal && (
        <CargaFileModal
          productId={id}
          tipo="imagen"
          onClose={() => setShowCargaModal(false)}
          onFilesUploaded={(files) => {
              if (files?.[0] && files[0].ruta) {
                setImagenPath(files[0].ruta); 
              }
            }}
        />
      )}
    </div>
  );
};

export default ManejoProductoModal;
