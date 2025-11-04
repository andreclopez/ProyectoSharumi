import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Package, X } from "lucide-react";
import Loader from "../../components/Loader";
import api from "../../services/api";

const CrearProductoModal = ({ isOpen, onClose, onProductCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [previewPortada, setPreviewPortada] = useState(null);
  const [previewsGaleria, setPreviewsGaleria] = useState([]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("stock", data.stock);
      formData.append("precio", data.precio);

      // Portada (única)
      if (data.portada?.[0]) {
        formData.append("portada", data.portada[0]);
      }

      // Galería (múltiples)
      if (data.imagenes?.length) {
        for (let i = 0; i < data.imagenes.length; i++) {
          formData.append("imagenes", data.imagenes[i]);
        }
      }

      const response = await api.post("/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        reset();
        setPreviewPortada(null);
        setPreviewsGaleria([]);
        if (onProductCreated) onProductCreated();
        onClose();
      } else {
        setError(response.message || "Error al crear el producto.");
      }
    } catch (err) {
      setError(err.message || "Error al crear el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setPreviewPortada(null);
    setPreviewsGaleria([]);
    onClose();
  };

  const handlePortadaPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewPortada(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGaleriaPreview = (e) => {
    if (e.target.files) {
      const previews = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewsGaleria(previews);
    }
  };

  if (!isOpen) return null;
  if (isLoading) return <Loader title="Creando producto..." />;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      <div className="relative bg-pink-50 rounded-lg shadow-2xl w-full max-w-md p-6 z-10 border border-pink-200/50">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center">
          <Package className="mr-2" size={24} />
          Crear Nuevo Producto
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Producto
            </label>
            <input
              type="text"
              placeholder="Ej: Producto Elegante"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                maxLength: { value: 50, message: "No puede superar los 50 caracteres" },
              })}
              className="mt-1 w-full rounded-md border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.nombre && (
              <p className="text-pink-600 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Describe las características principales del producto..."
              {...register("descripcion", {
                required: "La descripción es obligatoria",
                minLength: { value: 10, message: "Debe tener al menos 10 caracteres" },
                maxLength: { value: 500, message: "No puede superar los 500 caracteres" },
              })}
              className="mt-1 w-full rounded-md border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
            {errors.descripcion && (
              <p className="text-pink-600 text-sm mt-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Disponible
            </label>
            <input
              type="number"
              min="0"
              placeholder="100"
              {...register("stock", {
                required: "El stock es obligatorio",
                min: { value: 0, message: "El stock no puede ser negativo" },
                max: { value: 99999, message: "No puede superar 99,999 unidades" },
              })}
              className="mt-1 w-full rounded-md border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.stock && (
              <p className="text-pink-600 text-sm mt-1">{errors.stock.message}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="49.99"
              {...register("precio", {
                required: "El precio es obligatorio",
                min: { value: 0.01, message: "El precio debe ser mayor a $0.00" },
                max: { value: 999999.99, message: "No puede superar $999,999.99" },
              })}
              className="mt-1 w-full rounded-md border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.precio && (
              <p className="text-pink-600 text-sm mt-1">{errors.precio.message}</p>
            )}
          </div>

          {/* Portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Portada del Producto
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("portada", { required: "La portada es obligatoria" })}
              onChange={handlePortadaPreview}
              className="mt-1 w-full rounded-md border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            />
            {previewPortada && (
              <img
                src={previewPortada}
                alt="preview-portada"
                className="mt-2 max-h-40 object-contain rounded-md"
              />
            )}
            {errors.portada && (
              <p className="text-pink-600 text-sm mt-1">{errors.portada.message}</p>
            )}
          </div>

          {/* Galería */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Galería de Imágenes
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              {...register("imagenes")}
              onChange={handleGaleriaPreview}
              className="mt-1 w-full rounded-md border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            />
            {previewsGaleria.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previewsGaleria.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`preview-${idx}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearProductoModal;
