import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import Modal from '../../components/admin/Modal/Modal.jsx';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import Pagination from '../../components/admin/Paginacion.jsx';
import RenderSkeletonRows from '../../components/admin/RenderSkeletonRows.jsx';
import useAuthStore from '../../store/authStore.js';
import usuarioService from '../../services/usuarioService.js';
import { Users, Search, Filter, Plus } from "lucide-react";
import { IconButton, TableContainer } from '@mui/material';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import * as toast from '../../../src/utils/toast.js';
import moment from 'moment';

const API_URL = '/usuarios';

const UsuariosAdmin = () => {
  const { token } = useAuthStore();

  // Datos
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y orden
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal y edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Manejo de roles
  const rolesMap = {
    1: "Administrador",
    2: "Usuario",
    3: "Vendedor"
  };

  // FormData
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    idRol: 1,
    activo: true,
    fechaRegistro: new Date().toISOString().slice(0,16)
  });

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        sort: sortField,
        direction: sortDirection,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      const res = await api.get(API_URL, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuarios(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error cargando usuarios');
      setUsuarios([]);
      toast.error('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortField, sortDirection, statusFilter, token, itemsPerPage]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = `${u.nombre} ${u.apellido} ${u.email}`
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());

    const coincideEstado =
      statusFilter === 'all' || String(u.activo) === statusFilter;

    return coincideBusqueda && coincideEstado;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: '',
        idRol: user.idRol,
        activo: user.activo,
        fechaRegistro: moment(user.fechaRegistro).format('YYYY-MM-DDTHH:mm')
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        idRol: 1,
        activo: true,
        fechaRegistro: new Date().toISOString().slice(0,16)
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usuarioService.actualizarUsuario(editingUser.id, formData);
        toast.success('Usuario actualizado');
      } else {
        await usuarioService.crearUsuario(formData);
        toast.success('Usuario creado');
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar usuario');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await usuarioService.eliminarUsuarioForce(userToDelete.id);
      toast.success('Usuario eliminado');
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error('Error eliminando usuario');
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleToggleActivo = async (user) => {
    try {
      const updated = { ...user, activo: !user.activo };
      await usuarioService.actualizarUsuario(user.id, updated);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error('Error cambiando estado del usuario');
    }
  };

  const handleSort = (column) => {
    if (sortField === column) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else setSortField(column);
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#5a2a2a] flex items-center">
            <Users className="mr-2" />
            Gestión de Usuarios
          </h2>
          <p className="text-[#5a2a2a] mt-1">Administra los usuarios del sistema</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="pl-10 pr-4 py-2 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#5a2a2a]" />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-[#5a2a2a]" />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#a0522d] to-[#5a2a2a] text-[#fdf6f0] rounded-lg hover:from-[#5a2a2a] hover:to-orange-800 transition-all duration-200 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#fdf6f0' }}>
            <div className="bg-[#5a2a2a] p-4">
              <h2 className="text-[#fdf6f0] text-lg font-semibold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
            </div>
            
            <div className="p-6 text-[#5a2a2a]">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  required
                  className="p-2 border border-[#5a2a2a] rounded"
                />
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  required
                  className="p-2 border border-[#5a2a2a] rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="p-2 border border-[#5a2a2a] rounded"
                />
                {!editingUser && (
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Contraseña"
                    required
                    className="p-2 border border-[#5a2a2a] rounded"
                  />
                )}
                <select
                  name="idRol"
                  value={formData.idRol}
                  onChange={handleInputChange}
                  className="p-2 border border-[#5a2a2a] rounded"
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Usuario</option>
                  <option value={3}>Vendedor</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  <span>Activo</span>
                </label>
                <input
                  type="datetime-local"
                  name="fechaRegistro"
                  value={formData.fechaRegistro}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-[#5a2a2a] rounded"
                />

                <div className="flex gap-2">
                  <button type="submit" className="bg-[#5a2a2a] text-[#fdf6f0] hover:bg-[#a0522d] px-4 py-2 rounded">
                    Guardar
                  </button>
                  <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Loading Skeleton */}
      {loading && <RenderSkeletonRows itemsPerPage={itemsPerPage} />}

      {/* Error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Tabla */}
      {!loading && !error && (
        <>
          <TableContainer sx={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#5a2a2a] text-[#fdf6f0]">
                  <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('nombre')}>Nombre</th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('apellido')}>Apellido</th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('idRol')}>Rol</th>
                  <th className="py-2 px-4">Estado</th>
                  <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('fechaRegistro')}>Fecha registro</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(u => (
                    <tr
                      key={u.id}
                      className="border-b border-[#5a2a2a]/20 hover:bg-[#fdf6f0]/70 transition-colors duration-200"
                    >
                      <td className="py-2 px-4">{u.nombre}</td>
                      <td className="py-2 px-4">{u.apellido}</td>
                      <td className="py-2 px-4">{u.email}</td>
                      <td className="py-2 px-4">{rolesMap[u.idRol] || "Desconocido"}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-2 px-4">{new Date(u.fechaRegistro).toLocaleString()}</td>
                      <td className="py-2 px-4 flex space-x-2 justify-start items-center">
                        <IconButton onClick={() => handleOpenModal(u)} style={{ color: '#5a2a2a' }}>
                          <EditSquareIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleToggleActivo(u)} style={{ color: '#5a2a2a' }}>
                          {u.activo ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(u)} style={{ color: '#a0522d' }}>
                          <DeleteForever fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </TableContainer>

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Usuario"
          confirmClass="bg-[#5a2a2a] hover:bg-[#a0522d] text-[#fdf6f0]"
          width="w-[32rem]"
        >
          <p className="text-gray-700 text-base text-center">
            ⚠️ El usuario <strong>"{userToDelete?.email}"</strong> se eliminará permanentemente.  
            ¿Deseas continuar?
          </p>
        </ConfirmationDialog>
      )}
    </div>
  );
};

export default UsuariosAdmin;
