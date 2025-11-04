import { useState, useEffect } from "react";
import api from "../../services/api.js";
import Loader from "./Loader.jsx";

const ProductoImagen = ({ images, selectedImage, setSelectedImage }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="main-image w-full max-w-md bg-white rounded-lg overflow-hidden mb-4">
        <img
          src={images[selectedImage]?.apiUrl}
          alt={`Producto ${selectedImage + 1}`}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="flex space-x-2">
        {images.map((img, index) => (
          <button
            key={img.id}
            className={`thumbnail w-20 h-20 rounded-md overflow-hidden transition duration-200 ${
              selectedImage === index ? "outline-2 outline-primary" : ""
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={img.apiUrl}
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductoFiles = ({ files, onDownload, onDelete }) => {
  if (!files || files.length === 0) return <p>Sin archivos asociados</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-gray-100 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-lg"
        >
          <span className="material-icons text-4xl text-primary mb-2">article</span>
          <h3 className="text-sm font-medium mb-2">{file.nombreOriginal}</h3>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-primary text-white rounded-full text-sm hover:bg-secondary transition-colors"
              onClick={() => onDownload(file.nombre)}
            >
              Descargar
            </button>
            {onDelete && (
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                onClick={() => onDelete(file.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductoCardAdmin = ({ productId, onClose }) => {
  const [producto, setProducto] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, filesRes] = await Promise.all([
          api.get(`/productos/${productId}`),
          api.get(`/files/productos/${productId}`)
        ]);

        if (prodRes.data?.data){
          setProducto(prodRes.data.data);
          setProductImages(filesRes.data.images || []);
        } 
        if (filesRes.data?.archivos) setFiles(filesRes.data.archivos);
      } catch (err) {
        setError("Error cargando producto", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleDownload = async (fileName) => {
    try {
      const response = await api.get(`/files/download/${fileName}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(`Error al descargar archivo: ${err.message}`);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const res = await api.delete(`/files/${fileId}`);
      if (res.data?.success) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
      }
    } catch (err) {
      setError(`Error eliminando archivo: ${err.message}`);
    }
  };

  if (loading) return <Loader title="Cargando producto..." />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">{producto.nombre}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductoImagen
            images={productImages.length ? productImages : [{ apiUrl: producto.imagenUrl }]}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <div className="flex flex-col justify-start">
            <p className="mb-2">{producto.descripcion}</p>
            <p className="text-xl font-bold text-primary mb-4">${producto.precio}</p>
            <h3 className="text-lg font-semibold mb-2">Archivos asociados</h3>
            <ProductoFiles
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCardAdmin;

