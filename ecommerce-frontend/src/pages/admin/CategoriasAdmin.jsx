import { useState, useEffect } from 'react';
import categoriaService from '../../services/categoriaService.js';
import Cargando from '../../components/generales/Cargando.jsx';
import Error from '../../components/generales/Error.jsx';

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

//Estados para el formulario
  const [formVisible, setFormVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [activa, setActiva] = useState(true);

//Para editar
  const [editar, setEditar] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null)
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        setCargando(true);
        const response = await categoriaService.obtenerCategorias();
        setCategorias(response.data); // asumimos que la data está en response.data
        setError(null);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError('No se pudieron cargar las categorías.');
      } finally {
        setCargando(false);
      }
    };

    obtenerCategorias();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Editar:", editar, "categoriaEdit:", categoriaEdit);

  const categoriaData = { nombre, descripcion, imagenUrl, activa };

  try {
    let response;
    if (editar && categoriaEdit?.id) {
      response = await categoriaService.actualizarCategoria(categoriaEdit.id, categoriaData);
      setCategorias(categorias.map(cat => cat.id === categoriaEdit.id ? response.data : cat));
    } else {
      response = await categoriaService.crearCategoria(categoriaData);
      setCategorias([...categorias, response.data]);
    }

    // Limpiar estados
    setNombre("");
    setDescripcion("");
    setImagenUrl("");
    setActiva(true);
    setEditar(false);
    setCategoriaEdit(null);
    setFormVisible(false);
    
  } catch (err) {
    alert("Error al guardar la categoría");
    console.error(err);
  }
};
  
// Para editar
  const handleEditarClick = (cat) => {
    setEditar(true);
    setCategoriaEdit(cat);
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion);
    setImagenUrl(cat.imagenUrl);
    setActiva(cat.activa);
    setFormVisible(true);
  };

//Para eliminar
  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Seguro que querés eliminar esta categoría?");
    if (!confirm) return;
    
    try {
        await categoriaService.eliminarCategoria(id);
        setCategorias(categorias.filter(cat => cat.id !== id));
    } catch (err) {
        alert("Error al eliminar la categoría");
        console.error(err);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5a2a2a]">
            Gestión de Categorías
        </h2>
        
        <button
        className="bg-[#a0522d] text-center text-white px-4 py-2 rounded hover:bg-[#5a2a2a] transition"
        onClick={() => setFormVisible(!formVisible)}
        >
        Nueva Categoría
        </button>
      </div>

      {/*Formulario*/}
      {formVisible && (
        <form className="mb-6 p-4 border rounded bg-[#fdf6f0] flex flex-col space-y-4 "
        onSubmit={handleSubmit}
        >
            <input 
            type="text"
            placeholder='Ingresa el nombre de la categoría'
            className='p-2 border rounded'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            />

            <input 
            type="text"
            placeholder='Descripción de la categoría. (Opcional)'
            className='p-2 border rounded'
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            />

            <input 
            type="text"
            placeholder='Imagen de portada'
            className='p-2 border rounded'
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            />

            <label className='flex items-center space-x-2'>
                <input 
                type="checkbox"
                checked={activa}
                onChange={(e)=> setActiva(e.target.checked)} 
                />
                <span> Activa </span>
            </label>

            <div className='flex space-x-4'>
                <button type='submit' className='bg-[#a0522d] text-[#fdf6f0] px-4 py-2 rounded hover:bg-[#5a2a2a] transition' >
                    Guardar
                </button>
                <button 
                type='button'
                className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition'
                onClick={()=> setFormVisible(false)}
                >
                    Cancelar
                </button>
            </div>
        </form>
      )}

      {cargando && <Cargando mensaje="Cargando categorías..." />}
      {error && <Error mensaje={error} />}

      {!cargando && !error && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#5a2a2a] text-[#fdf6f0]">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Descripción</th>
              <th className="py-2 px-4">Imagen</th>
              <th className="py-2 px-4">Activa</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-300">
                <td className="py-2 px-4">{cat.id}</td>
                <td className="py-2 px-4">{cat.nombre}</td>
                <td className="py-2 px-4">{cat.descripcion}</td>
                <td className="py-2 px-4">
                    {cat.imagenUrl ? (
                        <img src={cat.imagenUrl} alt={cat.nombre} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      "-"
                    )}
                </td>
                <td className="py-2 px-4">{cat.activa ? "Sí" : "No"}</td>
                <td className="py-2 px-4 space-x-2">
                  <button className="px-3 py-1 bg-[#a0522d] hover:bg-[#5a2a2a] text-[#fdf6f0] rounded"
                  onClick={()=> handleEditarClick(cat)}
                  >
                    Editar
                  </button>
                  <button className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded"
                  onClick={()=> handleEliminar(cat.id)}>
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

export default CategoriasAdmin;
