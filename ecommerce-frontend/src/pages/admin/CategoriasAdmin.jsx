import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import Pagination from '../../components/admin/Paginacion.jsx';
import RenderSkeletonRows from '../../components/admin/RenderSkeletonRows.jsx';
import useAuthStore from '../../store/authStore.js';
import categoriaService from '../../services/categoriaService.js';
import ManejoCategoriaModal from '../../components/admin/Modal/ManejoCategoriaModal.jsx';
import { Tag, Search, Filter, Plus } from "lucide-react";
import { IconButton, TableContainer } from '@mui/material';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import * as toast from '../../../src/utils/toast.js';

const API_URL = '/categorias';

const CategoriasAdmin = () => {
  const { token } = useAuthStore();

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  const fetchCategorias = useCallback(async () => {
    setCargando(true);
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

      setCategorias(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error cargando categorías');
      setCategorias([]);
      toast.error('Error cargando categorías');
    } finally {
      setCargando(false);
    }
  }, [currentPage, debouncedSearchTerm, sortField, sortDirection, statusFilter, token, itemsPerPage]);

  useEffect(() => { fetchCategorias(); }, [fetchCategorias]);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500); return () => clearTimeout(timer); }, [searchTerm]);

  const categoriasFiltradas = categorias.filter(u => {
    const coincideBusqueda = `${u.nombre} ${u.descripcion}`.toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const coincideEstado = statusFilter === 'all' || String(u.activa) === statusFilter;
    return coincideBusqueda && coincideEstado;
  });

  // Funciones para abrir/cerrar
    const handleOpenModal = (cat = null) => {
        let categoryWithFullUrl = cat;
        if (cat && cat.imagenUrl) {
            const baseUrlClean = import.meta.env.VITE_API_URL.replace('/api','');

            categoryWithFullUrl = { 
                ...cat, 
                fullImagenUrl: `${baseUrlClean}${cat.imagenUrl}` 
            };
        }
        setEditingCat(categoryWithFullUrl); 
        setIsModalOpen(true);
      };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCat(null);
      };

  const handleSaveCategory = async (e, modalFormData, categoryToEdit) => {
    e.preventDefault();
    
    // Si hay un nuevo archivo de imagen
    const hasNewImage = modalFormData.portada instanceof File;
    
    try {
        if (categoryToEdit) {
            if (hasNewImage) { 
                // Hay nueva imagen. Envía FormData con todos los campos.
                const data = new FormData();
                data.append('nombre', modalFormData.nombre);
                data.append('descripcion', modalFormData.descripcion || '');
                data.append('activa', modalFormData.activa ? 'true' : 'false'); 
                data.append('portada', modalFormData.portada);

                await categoriaService.actualizarCategoria(categoryToEdit.id, data);
                toast.success('Categoría y portada actualizadas');

            } else {
                // Actualiza SOLO TEXTO/ESTADO: Usar JSON
                const updateData = {
                    nombre: modalFormData.nombre,
                    descripcion: modalFormData.descripcion,
                    activa: modalFormData.activa, 
                };
                await categoriaService.actualizarCategoria(categoryToEdit.id, updateData);
                toast.success('Categoría de texto actualizada');
            }

        } else {
            // --- POST ---
            const data = new FormData();
            data.append('nombre', modalFormData.nombre);
            data.append('descripcion', modalFormData.descripcion || '');
            data.append('activa', modalFormData.activa ? 'true' : 'false');
            
            // Si hay portada, la adjuntamos.
            if (!hasNewImage) {
                toast.error('La portada es obligatoria para crear una categoría.');
                return;
            }
            data.append('portada', modalFormData.portada);
            
            await categoriaService.crearCategoria(data);
            toast.success('Categoría creada exitosamente');
        }

        handleCloseModal();
        fetchCategorias();

    } catch (err) {
      console.error(err);
      toast.error('Error al guardar categoría');
    }
  };

  const handleDeleteClick = (cat) => { setCatToDelete(cat); setShowDeleteConfirm(true); };
  const handleConfirmDelete = async () => {
    try { await categoriaService.eliminarCategoria(catToDelete.id); toast.success('Categoría eliminada'); fetchCategorias(); }
    catch (err) { console.error(err); toast.error('Error eliminando categoría'); }
    setShowDeleteConfirm(false);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleToggleActivo = async (cat) => {
    try {
      const updated = { ...cat, activa: !cat.activa };
      await categoriaService.actualizarCategoria(cat.id, updated);
      fetchCategorias();
    } catch (err) {
      console.error(err);
      toast.error('Error cambiando estado de categoría');
    }
  };

  const handleUpdatePortada = async (categoriaId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('portada', file);

    try {
      await categoriaService.actualizarPortada(categoriaId, formData);
      toast.success("Portada actualizada!");
      fetchCategorias();
    } catch (err) {
      console.error(err);
      toast.error('Error actualizando portada');
    }
  };

  const handleSort = (column) => {
    if (sortField === column) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else setSortField(column);
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-6">
      {/* Header y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#5a2a2a] flex items-center"><Tag className="mr-2" />Gestión de Categorías</h2>
          <p className="text-[#5a2a2a] mt-1">Administra las categorías del sistema</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input type="text" placeholder="Buscar categoría..." className="pl-10 pr-4 py-2 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#5a2a2a]" />
          </div>
          <div className="relative">
            <select className="pl-10 pr-4 py-2 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-[#5a2a2a]" />
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#a0522d] to-[#5a2a2a] text-[#fdf6f0] rounded-lg hover:from-[#5a2a2a] hover:to-orange-800 transition-all duration-200 shadow-md">
            <Plus className="h-5 w-5 mr-2" />Nueva Categoría
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ManejoCategoriaModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          editingCategory={editingCat}
          onSave={handleSaveCategory} 
        />
      )}

      {/* LISTADO */}
      {cargando && <RenderSkeletonRows itemsPerPage={itemsPerPage} />}

      {error && <div className="text-red-500">{error}</div>}

      {!cargando && !error && (
        <>
        <TableContainer sx={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#5a2a2a] text-[#fdf6f0]">
                          <th className="py-2 px-4">Portada</th>
                          <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('nombre')}>Nombre</th>
                          <th className="py-2 px-4">Descripción</th>
                          <th className="py-2 px-4">Estado</th>
                          <th className="py-2 px-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriasFiltradas
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((u) => (
                            <tr
                              key={u.id}
                              className="border-b border-[#5a2a2a]/20 hover:bg-[#fdf6f0]/70 transition-colors duration-200"
                            >
                              <td className="py-2 px-4">
                                <div className="relative group w-16 h-16 rounded overflow-hidden">
                                  {u.imagenUrl && (
                                    <>
                                      <img
                                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${u.imagenUrl}`}
                                        alt={u.nombre}
                                        className="w-16 h-16 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                                        title="Cambiar portada"
                                      />
                                      <label
                                        title="Cambiar portada"
                                        className="absolute inset-0 bg-[#5a2a2a] bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white text-xs font-semibold"
                                      >
                                        Cambiar
                                        <input
                                          type="file"
                                          hidden
                                          onChange={(e) => handleUpdatePortada(u.id, e.target.files[0])}
                                        />
                                      </label>
                                    </>
                                  )}
                                </div>
                              </td>
                              {/* Nombre y descripción */}
                              <td className="py-2 px-4">{u.nombre}</td>
                              <td className="py-2 px-4">{u.descripcion}</td>
                              {/* Estado */}
                              <td className="py-2 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    u.activa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {u.activa ? "Activa" : "Inactiva"}
                                </span>
                              </td>
        
                              {/* Acciones */}
                              <td className="py-2 px-4 flex space-x-2 justify-start items-center">
                                <IconButton onClick={() => handleOpenModal(u)} style={{ color: "#5a2a2a" }}>
                                  <EditSquareIcon />
                                </IconButton>
                                <IconButton onClick={() => handleToggleActivo(u)} style={{ color: "#5a2a2a" }}>
                                  {u.activa ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(u)} style={{ color: "#a0522d" }}>
                                  <DeleteForever />
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </TableContainer>
          
          <div style={{ position: 'relative', zIndex: 1, marginTop: '1.5rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Categoría" 
          confirmClass="bg-[#5a2a2a] hover:bg-[#a0522d] text-[#fdf6f0]" 
          width="w-[32rem]" 
        >
          <p className="text-gray-700 text-base text-center">
            ⚠️ La categoría **"{catToDelete?.nombre}"** se eliminará permanentemente. ¿Deseas continuar?
          </p>
        </ConfirmationDialog>
      )}

    </div>
  );
};

export default CategoriasAdmin;
