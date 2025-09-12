// esta es una opcion para usuarioAdmin.jsx
import { useState, useEffect } from 'react';
import usuarioService from '../../services/usuarioService.js';
import Cargando from '../../components/generales/Cargando.jsx';
import Error from '../../components/generales/Error.jsx';

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [formVisible, setFormVisible] = useState(false);
  const [editar, setEditar] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [idRol, setIdRol] = useState(1); // 1 = Usuario, 2 = Admin
  const [activo, setActivo] = useState(true);
  const [password, setPassword] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString().slice(0,16));

  // Obtener usuarios
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        setCargando(true);
        const response = await usuarioService.obtenerUsuarios();
        // Asegurarnos que siempre sea un array
        const usuariosArray = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        setUsuarios(usuariosArray);
        setError(null);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioData = { nombre, apellido, email, idRol, activo, fechaRegistro };
    if (!editar) usuarioData.password = password; // solo al crear

    try {
      let response;
      if (editar && usuarioEdit?.id) {
        response = await usuarioService.actualizarUsuario(usuarioEdit.id, usuarioData);
        setUsuarios(prev => prev.map(u => u.id === usuarioEdit.id ? response.data.data || response.data : u));
      } else {
        response = await usuarioService.crearUsuario(usuarioData);
        setUsuarios(prev => [...prev, response.data.data || response.data]);
      }

      // Limpiar formulario
      setNombre('');
      setApellido('');
      setEmail('');
      setIdRol(1);
      setActivo(true);
      setPassword('');
      setFechaRegistro(new Date().toISOString().slice(0,16));
      setEditar(false);
      setUsuarioEdit(null);
      setFormVisible(false);
    } catch (err) {
      alert('Error al guardar el usuario. Revisá la consola.');
      console.error(err);
    }
  };

  // Editar usuario
  const handleEditarClick = (usuario) => {
    setEditar(true);
    setUsuarioEdit(usuario);
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEmail(usuario.email);
    setIdRol(usuario.idRol);
    setActivo(usuario.activo);
    setPassword('');
    setFormVisible(true);
  };

  // Toggle activo
  const handleToggleActivo = async (usuario) => {
    try {
      const updated = { ...usuario, activo: !usuario.activo };
      await usuarioService.actualizarUsuario(usuario.id, updated);
      setUsuarios(prev => prev.map(u => u.id === usuario.id ? updated : u));
    } catch (err) {
      alert('Error al cambiar el estado del usuario.');
      console.error(err);
    }
  };

  // Hard delete
  const handleEliminar = async (usuario) => {
    const confirmDelete = window.confirm(
      `⚠️ Este usuario podría tener datos asociados (pedidos, mensajes). ¿Deseas eliminarlo definitivamente?`
    );
    if (!confirmDelete) return;

    try {
      await usuarioService.eliminarUsuarioForce(usuario.id); 
      setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
    } catch (err) {
      alert('No se pudo eliminar el usuario definitivamente.');
      console.error(err);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5a2a2a]">Gestión de Usuarios</h2>
        <button
          className="bg-[#a0522d] text-white px-4 py-2 rounded hover:bg-[#5a2a2a]"
          onClick={() => setFormVisible(!formVisible)}
        >
          Nuevo Usuario
        </button>
      </div>

      {/* Formulario */}
      {formVisible && (
        <form className="mb-6 p-4 border rounded bg-[#fdf6f0] flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="p-2 border rounded" />
          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="p-2 border rounded" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border rounded" />
          {!editar && (
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border rounded" />
          )}
          <select value={idRol} onChange={(e) => setIdRol(Number(e.target.value))} className="p-2 border rounded">
            <option value={1}>Usuario</option>
            <option value={2}>Administrador</option>
          </select>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            <span>Activo</span>
          </label>
          <input type="datetime-local" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} required className="p-2 border rounded"/>

          <div className="flex space-x-4">
            <button type="submit" className="bg-[#a0522d] text-[#fdf6f0] px-4 py-2 rounded hover:bg-[#5a2a2a]">Guardar</button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setFormVisible(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {cargando && <Cargando mensaje="Cargando usuarios..." />}
      {error && <Error mensaje={error} />}

      {!cargando && !error && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#5a2a2a] text-[#fdf6f0]">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Apellido</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Rol</th>
              <th className="py-2 px-4">Activo</th>
              <th className="py-2 px-4">Fecha registro</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b border-gray-300">
                <td className="py-2 px-4">{u.id}</td>
                <td className="py-2 px-4">{u.nombre}</td>
                <td className="py-2 px-4">{u.apellido}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.idRol === 1 ? 'Usuario' : 'Administrador'}</td>
                <td className="py-2 px-4">{u.activo ? 'Sí' : 'No'}</td>
                <td className="py-2 px-4">{u.fechaRegistro}</td>
                <td className="py-2 px-4 space-x-2">
                  <button className="px-3 py-1 bg-[#a0522d] hover:bg-[#5a2a2a] text-[#fdf6f0] rounded" onClick={() => handleEditarClick(u)}>Editar</button>
                  <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded" onClick={() => handleToggleActivo(u)}>
                    {u.activo ? 'Inactivar' : 'Activar'}
                  </button>
                  <button className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded" onClick={() => handleEliminar(u)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsuariosAdmin;
