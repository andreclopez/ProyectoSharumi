import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom"; 
import api from "../../services/api.js";
import Loader from "../../components/admin/Loader.jsx";
import { Plus, Trash2, Download } from "lucide-react"; 
import ImageIcon from "@mui/icons-material/Image"; 
import * as toast from "../../../src/utils/toast.js"; 
import { FolderIcon } from '@heroicons/react/20/solid';

const GaleriaAdmin = () => {
  // 1. Obtener el ID del producto
  const { idProducto } = useParams(); 

  // Estados
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // 2. Función para obtener los archivos del producto
  const fetchArchivos = useCallback(async () => {
    if (!idProducto) return;
    try {
      setLoading(true);

      const cacheBuster = Date.now();

      const res = await api.get(`/files/productos/${idProducto}?v=${cacheBuster}`);

      setArchivos(res.data.images || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error cargando archivos del producto: " + err.message);
      toast.error("Error cargando galería");
    } finally {
      setLoading(false);
    }
  }, [idProducto]);

  useEffect(() => {
    fetchArchivos();
  }, [fetchArchivos]);

  // 3. Subir archivos
  const handleUpload = async (e) => {
    e.preventDefault();

    if (fileList.length === 0) {
      toast.error("Selecciona al menos un archivo");
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => formData.append("imagenes", file));

    try {
      await api.post(`/files/${idProducto}/galeria`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Archivos subidos correctamente");
      setFileList([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
      fetchArchivos(); 
    } catch (err) {
      console.error(err);
      setError("Error subiendo archivo: " + err.message);
      toast.error("Error subiendo galería");
    }
  };

  // 4. Eliminar archivo
  const handleDelete = async (id, nombreOriginal) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombreOriginal}"?`)) return;
    try {
      await api.delete(`/files/archivo/${id}`);
      setArchivos((prev) => prev.filter((a) => a.id !== id));
      toast.success("Archivo eliminado correctamente");
    } catch (err) {
      console.error(err);
      setError("Error eliminando archivo: " + err.message);
      toast.error("Error eliminando archivo");
    }
  };

  if (loading) return <Loader title={`Cargando galería del producto ${idProducto}...`} />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="p-6 bg-[#fdf6f0] min-h-screen">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-2 text-[#5a2a2a]">
        <FolderIcon className="h-6 w-6" />
        Galería del Producto: {idProducto}
      </h2>

      <p className="mb-6 text-[#5a2a2a]">
        Administra las imágenes y archivos asociados.
      </p>

      {/* Formulario de subida */}
      <form
        onSubmit={handleUpload}
        className="mb-8 p-4 border border-[#a0522d] rounded-lg bg-white shadow-sm flex flex-col md:flex-row gap-3 items-center"
      >
        <label className="text-[#5a2a2a] font-medium min-w-[150px]">
          Seleccionar Archivos:
        </label>
        <input
          id="fileInput"
          name="imagenes"
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => setFileList(Array.from(e.target.files))}
          className="flex-grow border border-[#a0522d] rounded px-2 py-1 bg-gray-50"
        />
        <button
          type="submit"
          disabled={fileList.length === 0}
          className={`flex items-center justify-center px-4 py-2 rounded shadow-md min-w-[100px] transition-colors ${
            fileList.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5a2a2a] text-[#fdf6f0] hover:bg-[#a0522d]"
          }`}
        >
          <Plus className="h-5 w-5 mr-1" />
          Subir ({fileList.length})
        </button>
      </form>

      {/* Lista de archivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {archivos.length === 0 ? (
          <p className="text-[#5a2a2a] col-span-full">
            Este producto aún no tiene archivos en la galería.
          </p>
        ) : (
          archivos.map((a) => {
            const isImage = a.type?.startsWith("image");
            const imageUrl =
              `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/files/image/${a.filename}?v=${Date.now()}`; 
              
            const downloadUrl = `${import.meta.env.VITE_API_URL.replace(
              "/api",
              ""
            )}/api/files/download/${a.filename}`;

            return (
              <div
                key={a.id}
                className="bg-white border border-[#a0522d]/50 rounded-lg p-4 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow"
              >
                {isImage ? (
                  <img
                    src={imageUrl}
                    alt={a.originalName}
                    className="w-full h-32 object-contain rounded mb-3 border border-gray-100"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center mb-3">
                    <ImageIcon className="text-6xl text-[#a0522d]" />
                  </div>
                )}

                <p
                  className="text-sm font-medium mb-2 text-[#5a2a2a] text-center truncate w-full"
                  title={a.originalName}
                >
                  {a.originalName}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  {(a.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => window.open(downloadUrl, "_blank")}
                    className="flex items-center bg-[#d9b08c] text-[#5a2a2a] px-3 py-1 rounded text-sm hover:bg-[#a0522d] hover:text-white transition-colors"
                    title="Descargar"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id, a.originalName)}
                    className="flex items-center bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GaleriaAdmin;
