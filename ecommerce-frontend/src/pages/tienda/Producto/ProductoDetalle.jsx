import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { ShoppingCart, MessageSquare, DollarSign } from 'lucide-react';
import { useCart } from "../../../hooks/useCart";
import { useToastAlerts } from '../../../utils/toastAlerts';

// Define la URL base de tu API
const API_BASE_URL = 'http://localhost:3001'; 

const IMG_BASE_URL = API_BASE_URL; 

const ProductoDetalle = () => {
  const { id } = useParams();
  const { user, accessToken } = useAuth();
  const [producto, setProducto] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [imagenActiva, setImagenActiva] = useState('');
  const [mensajes, setMensajes] = useState([]); 
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const { addToCart } = useCart();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToastAlerts();

  useEffect(() => {
    const fetchDatos = async () => {
        setCargando(true);
        setError(null);
        try {
            
            const resProducto = await axios.get(`${API_BASE_URL}/api/productos/${id}`);
            setProducto(resProducto.data.data);

            const cacheBuster = Date.now();
            const resGaleria = await axios.get(`${API_BASE_URL}/api/files/productos/${id}?v=${cacheBuster}`);

            console.log('Respuesta de la API Galería:', resGaleria.data);

            setGaleria(resGaleria.data.images || []);

            console.log('Imágenes guardadas en el estado:', resGaleria.data.images);

            const portadaUrl = `${API_BASE_URL}${resProducto.data.data.imagenUrl}`;
            setImagenActiva(portadaUrl);
        
        } catch (err) {
          console.error('Error al cargar el producto:', err.response?.data || err);
          setError('No se pudo cargar el detalle del producto.');
          setCargando(false); 
          return; 
        }
        
        try{
          const resMensajes = await axios.get(`${API_BASE_URL}/api/productos/${id}/mensajes`);
          setMensajes(resMensajes.data.data);
        } catch (err) {
          console.warn('No se pudieron cargar los mensajes:', err.response?.data || err);
        } finally {
          setCargando(false);
        }
    };
    fetchDatos();
  }, [id]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !user) return;
    
    try {
        await axios.post(
          `http://localhost:3001/api/productos/${id}/mensajes`,
          { texto: nuevoMensaje }, 
          { headers: { 'Authorization': `Bearer ${accessToken}` } } 
          );

        setNuevoMensaje('');

        // Recargar solo los mensajes 
        const res = await axios.get(`http://localhost:3001/api/productos/${id}/mensajes`);
        setMensajes(res.data.data);

        showSuccess('Mensaje enviado con éxito 🕊️');

    } catch (err) {
      console.error(err);
      showError('Error al enviar el mensaje. Por favor, inténtalo de nuevo');
    }
  };

  if (cargando) return <p className="text-center p-8 text-[#5a2a2a]">Cargando producto...</p>;
  if (error) return <p className="text-center p-8 text-red-600 font-bold">{error}</p>;
  if (!producto) return null; 

  const handleSelectImagen = (url) => {
    setImagenActiva(url);
  };

  // Construcción de la URL de la imagen
  const imageUrl = producto.imagenUrl 
    ? `${IMG_BASE_URL}${producto.imagenUrl}`
    : '/ruta/a/imagen/default.png'; 

  // 💡 CÁLCULO DEL PRECIO Y DESCUENTO 
  const precioOriginal = producto.precio;
  const descuentoPorcentaje = producto.descuento || 0;
  
  const tieneDescuento = descuentoPorcentaje > 0;
  let precioFinal = precioOriginal;

  if (tieneDescuento) {
      // Calcular el precio con descuento
      const montoDescuento = precioOriginal * (descuentoPorcentaje / 100);
      precioFinal = precioOriginal - montoDescuento;
  }
  
  // Formatear precios para una mejor visualización (opcional, pero recomendado)
  const formatoPrecio = (precio) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#fdf6f0] shadow-2xl rounded-3xl my-8">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Imagen del producto */}
        <div className="w-full lg:w-1/2 p-4"> 
        {/* Imagen principal */}
        <div className="mb-4 border-2 border-[#a0522d] rounded-xl shadow-lg overflow-hidden">
        {imagenActiva ? (
            <img 
                src={imagenActiva} 
                alt={producto.nombre} 
                className="w-full h-96 **object-cover** bg-[#fdf6f0]" 
            />
        ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Miniaturas de la galería */}
        {(galeria.length > 0 || producto?.imagenUrl) && (
            <div className="flex space-x-3 overflow-x-auto p-2">
                {/* 1. Miniatura de la Portada */}
                {producto?.imagenUrl && (
                  <img
                    src={`${IMG_BASE_URL}${producto.imagenUrl}`}
                    alt="Portada"
                    onClick={() => handleSelectImagen(`${IMG_BASE_URL}${producto.imagenUrl}`)}
                    className={`h-16 w-16 object-cover rounded-lg border-2 cursor-pointer transition-colors 
                    ${imagenActiva === `${IMG_BASE_URL}${producto.imagenUrl}` ? 'border-[#5a2a2a]' : 'border-transparent hover:border-[#a0522d]'}`}
                  />
                )}
                
                {/* 2. Miniaturas de la Galería */}
                {galeria.map((img) => {
                  const imageUrl = img.imageUrl; 
                    return (
                      <img
                        key={img.id}
                        src={imageUrl} 
                        alt={img.originalName}
                        onClick={() => handleSelectImagen(imageUrl)}
                        className={`h-16 w-16 object-cover rounded-lg border-2 cursor-pointer transition-colors 
                            ${imagenActiva === imageUrl ? 'border-[#5a2a2a]' : 'border-transparent hover:border-[#a0522d]'}`}
                      />
                    );
                  })}
            </div>
          )}
        </div>
        
        {/* Columna de Detalles */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#5a2a2a] mb-2">{producto.nombre}</h1>
            <p className="text-lg text-gray-600 mb-4">{producto.descripcion || 'Sin descripción.'}</p>

            <div className="mb-6">
              {tieneDescuento && (
                    <div className="text-gray-500 line-through text-lg font-medium flex items-center mb-1">
                        Precio normal: {formatoPrecio(precioOriginal)}
                    </div>
                )}

                <div className="flex items-center text-4xl font-extrabold text-[#a0522d]">
                    <span>{formatoPrecio(precioFinal)}</span>
                    {tieneDescuento && (
                        <span className="ml-3 text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                            {descuentoPorcentaje}% OFF
                        </span>
                    )}
                </div>
            </div>
            
             <button
              className="w-full flex items-center justify-center bg-[#5a2a2a] text-[#fdf6f0] py-4 rounded-xl font-bold text-xl hover:bg-[#a0522d] transition-colors shadow-xl" // Botón más grande y color primario
              onClick={() => addToCart({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: imageUrl
              })}
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
      
      <hr className="my-8 border-t border-[#d9b08c]" />

      {/* Sección de Mensajes/Comentarios */}
      <h2 className="text-3xl font-extrabold text-[#5a2a2a] flex items-center mb-6">
        <MessageSquare className="w-7 h-7 mr-2 text-[#a0522d]" />
        Preguntas y Mensajes
      </h2>
      
      <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2"> 
        {mensajes.length > 0 ? (
      mensajes.map((msg) => (
        <div key={msg.id} className="bg-white p-3 rounded-lg shadow-sm">
          <p className="font-bold text-sm text-[#5a2a2a]">{msg.usuario?.nombre || 'Usuario'}</p>
          <p className="text-gray-700">{msg.texto}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-500 italic">Aún no hay mensajes para este producto.</p>
    )}
      </div>

      {/* Formulario de Mensaje */}
      {user && (
        <div className="mt-6 border-t border-[#d9b08c] pt-6">
        <textarea
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          rows="3"
          className="w-full p-4 border-2 border-[#a0522d] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a2a2a] resize-none" 
        />
        <button
          onClick={enviarMensaje}
          disabled={!nuevoMensaje.trim()}
          className="mt-4 bg-[#a0522d] text-[#fdf6f0] px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#5a2a2a] transition-colors disabled:opacity-50"
        >
          Enviar Mensaje
        </button>
      </div>
      )}
    </div>
  );
};

export default ProductoDetalle;