import { useState, useEffect } from 'react';
import productoService from '../../services/productoService.js';
import Cargando from '../../components/generales/Cargando.jsx';
import Error from '../../components/generales/Error.jsx';

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [formVisible, setFormVisible] = useState(false);
  const [editar, setEditar] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [oferta, setOferta] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [idUsuario, setIdUsuario] = useState("");
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        const response = await productoService.obtenerProductos();
        setProductos(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error al obtener los productos:', err);
        setError('No se pudieron cargar los productos.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productoData = {
      nombre,
      descripcion,
      imagenUrl,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      oferta,
      descuento: parseInt(descuento),
      idUsuario: parseInt(idUsuario) || 9,
      activo: editar ? activo : true   // solo aparece en editar
    };

    try {
      let response;
      if (editar && productoEdit?.id) {
        response = await productoService.actualizarProducto(productoEdit.id, productoData);
        setProductos(prev => prev.map(prod => prod.id === productoEdit.id ? response.data.data : prod));
      } else {
        response = await productoService.crearProducto(productoData);
        setProductos(prev => [...prev, response.data.data]);
      }

      // Limpiar formulario
      setNombre("");
      setDescripcion("");
      setImagenUrl("");
      setPrecio("");
      setStock("");
      setOferta(false);
      setDescuento(0);
      setIdUsuario("");
      setEditar(false);
      setProductoEdit(null);
      setFormVisible(false);

    } catch (err) {
      console.error("Error en handleSubmit:", err);
      alert("Error al guardar el producto. Revisá la consola para más detalles.");
    }
  };

  // Editar
  const handleEditarClick = (prod) => {
    setEditar(true);
    setProductoEdit(prod);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion);
    setImagenUrl(prod.imagenUrl);
    setPrecio(prod.precio);
    setStock(prod.stock);
    setOferta(prod.oferta);
    setDescuento(prod.descuento);
    setIdUsuario(prod.idUsuario);
    setActivo(prod.activo);
    setFormVisible(true);
  };

  // Eliminar - Inactiva el producto
  const handleEliminar = async (id) => {
    const confirmDelete = window.confirm("Este producto no se puede eliminar porque tiene datos asociados");
    if (!confirmDelete) return;

    try {
      await productoService.eliminarProducto(id);
      setProductos(prev => prev.filter(prod => prod.id !== id));
    } catch (err) {
      console.error(`Error al eliminar producto con ID ${id}:`, err);
      if (err.response?.status === 400) {
        alert("No se pudo eliminar el producto por que tiene datos asociados.");
      } else {
        alert("Error inesperado al eliminar el producto.");
      }
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5a2a2a]">Gestión de Productos</h2>
        <button
          className="bg-[#a0522d] text-white px-4 py-2 rounded hover:bg-[#5a2a2a] transition"
          onClick={() => setFormVisible(!formVisible)}
        >
          Nuevo Producto
        </button>
      </div>

      {/* Formulario */}
      {formVisible && (
        <form 
          className="mb-6 p-4 border rounded bg-[#fdf6f0] flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <input 
            type="text"
            placeholder='Nombre del producto'
            className='p-2 border rounded'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input 
            type="text"
            placeholder='Descripción'
            className='p-2 border rounded'
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input 
            type="text"
            placeholder='Imagen URL'
            className='p-2 border rounded'
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
          />
          <input 
            type="number"
            placeholder='Precio'
            className='p-2 border rounded'
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <input 
            type="number"
            placeholder='Stock'
            className='p-2 border rounded'
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <input 
            type="number"
            placeholder='Descuento (%)'
            className='p-2 border rounded'
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
          />
          <input 
            type="number"
            placeholder='ID Usuario'
            className='p-2 border rounded'
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={oferta}
              onChange={(e) => setOferta(e.target.checked)}
            />
            <span>Oferta</span>
          </label>

          <label className='flex items-center space-x-2'>
                <input 
                type="checkbox"
                checked={activo}
                onChange={(e)=> setActivo(e.target.checked)} 
                />
                <span>Activo</span>
            </label>

          <div className='flex space-x-4'>
            <button type='submit' className='bg-[#a0522d] text-[#fdf6f0] px-4 py-2 rounded hover:bg-[#5a2a2a] transition'>Guardar</button>
            <button 
              type='button'
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition'
              onClick={()=> setFormVisible(false)}
            >Cancelar</button>
          </div>
        </form>
      )}

      {cargando && <Cargando mensaje="Cargando productos..." />}
      {error && <Error mensaje={error} />}

      {!cargando && !error && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#5a2a2a] text-[#fdf6f0]">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Descripción</th>
              <th className="py-2 px-4">Imagen</th>
              <th className="py-2 px-4">Precio</th>
              <th className="py-2 px-4">Stock</th>
              <th className="py-2 px-4">Descuento</th>
              <th className="py-2 px-4">ID Usuario</th>
              <th className="py-2 px-4">Oferta</th>
              <th className="py-2 px-4">Activo</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(productos) && productos.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-300">
                <td className="py-2 px-4">{prod.id}</td>
                <td className="py-2 px-4">{prod.nombre}</td>
                <td className="py-2 px-4">{prod.descripcion}</td>
                <td className="py-2 px-4">
                  {prod.imagenUrl ? (
                    <img src={prod.imagenUrl} alt={prod.nombre} className="w-12 h-12 object-cover rounded" />
                  ) : "-"}
                </td>
                <td className="py-2 px-4">{prod.precio}</td>
                <td className="py-2 px-4">{prod.stock}</td>
                <td className="py-2 px-4">{prod.descuento}</td>
                <td className="py-2 px-4">{prod.idUsuario}</td>
                <td className="py-2 px-4">{prod.oferta ? "Sí" : "No"}</td>
                <td className="py-2 px-4">{prod.activo ? "Sí" : "No"}</td>
                <td className="py-2 px-4 space-x-2">
                  <button 
                    className="px-3 py-1 bg-[#a0522d] hover:bg-[#5a2a2a] text-[#fdf6f0] rounded"
                    onClick={()=> handleEditarClick(prod)}
                  >
                    Editar
                  </button>
                  <button 
                    className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded"
                    onClick={()=> handleEliminar(prod.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductosAdmin;
